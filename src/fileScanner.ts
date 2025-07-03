// src/fileScanner.ts
// Power Query Cross-Reference Extension - File Scanner
// Discovers and tracks .pq/.m files in workspace

import * as vscode from 'vscode';
import * as path from 'path';

export interface PowerQueryFile {
    uri: vscode.Uri;
    relativePath: string;
    fileName: string;
    lastModified: number;
    content?: string;
}

export interface PowerQuerySymbol {
    name: string;
    type: 'function' | 'variable' | 'record';
    file: PowerQueryFile;
    line: number;
    documentation?: string;
    parameters?: Array<{
        name: string;
        type: string;
        isRequired: boolean;
        isNullable: boolean;
        description?: string;
    }>;
    fields?: Array<{
        name: string;
        type: string;
        description?: string;
    }>;
}

export class FileScanner {
    private _onDidChangeFiles = new vscode.EventEmitter<PowerQueryFile[]>();
    public readonly onDidChangeFiles = this._onDidChangeFiles.event;

    private discoveredFiles: Map<string, PowerQueryFile> = new Map();
    private fileWatcher?: vscode.FileSystemWatcher;
    private workspaceRoot?: string;

    constructor(private context: vscode.ExtensionContext) {
        this.setupWorkspaceRoot();
        this.setupFileWatcher();
    }

    private setupWorkspaceRoot(): void {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (workspaceFolders && workspaceFolders.length > 0) {
            this.workspaceRoot = workspaceFolders[0].uri.fsPath;
        }
    }

    private setupFileWatcher(): void {
        // Watch for Power Query files
        this.fileWatcher = vscode.workspace.createFileSystemWatcher('**/*.{pq,m,pqm}');
        
        this.fileWatcher.onDidCreate(uri => this.handleFileChange(uri, 'created'));
        this.fileWatcher.onDidChange(uri => this.handleFileChange(uri, 'changed'));
        this.fileWatcher.onDidDelete(uri => this.handleFileChange(uri, 'deleted'));

        this.context.subscriptions.push(this.fileWatcher);
    }

    private async handleFileChange(uri: vscode.Uri, changeType: 'created' | 'changed' | 'deleted'): Promise<void> {
        const filePath = uri.fsPath;

        switch (changeType) {
            case 'created':
            case 'changed':
                await this.addOrUpdateFile(uri);
                break;
            case 'deleted':
                this.discoveredFiles.delete(filePath);
                break;
        }

        // Notify listeners
        this._onDidChangeFiles.fire(Array.from(this.discoveredFiles.values()));
    }

    private async addOrUpdateFile(uri: vscode.Uri): Promise<void> {
        try {
            const stat = await vscode.workspace.fs.stat(uri);
            const relativePath = this.workspaceRoot 
                ? path.relative(this.workspaceRoot, uri.fsPath)
                : uri.fsPath;

            const file: PowerQueryFile = {
                uri,
                relativePath,
                fileName: path.basename(uri.fsPath),
                lastModified: stat.mtime
            };

            this.discoveredFiles.set(uri.fsPath, file);
        } catch (error) {
            console.error(`Error processing file ${uri.fsPath}:`, error);
        }
    }

    public async scanWorkspace(): Promise<PowerQueryFile[]> {
        const files = await vscode.workspace.findFiles('**/*.{pq,m,pqm}', '**/node_modules/**');
        
        this.discoveredFiles.clear();

        for (const uri of files) {
            await this.addOrUpdateFile(uri);
        }

        return Array.from(this.discoveredFiles.values());
    }

    public async getFileContent(file: PowerQueryFile): Promise<string> {
        if (!file.content) {
            try {
                const content = await vscode.workspace.fs.readFile(file.uri);
                file.content = Buffer.from(content).toString('utf8');
            } catch (error) {
                console.error(`Error reading file ${file.uri.fsPath}:`, error);
                file.content = '';
            }
        }
        return file.content;
    }

    public getDiscoveredFiles(): PowerQueryFile[] {
        return Array.from(this.discoveredFiles.values());
    }

    public getFileByPath(filePath: string): PowerQueryFile | undefined {
        return this.discoveredFiles.get(filePath);
    }

    public async extractSymbols(file: PowerQueryFile): Promise<PowerQuerySymbol[]> {
        const content = await this.getFileContent(file);
        const symbols: PowerQuerySymbol[] = [];

        // Split content into lines for line number tracking
        const lines = content.split('\n');

        // Basic regex patterns for Power Query symbols
        const patterns = {
            // Variable assignment: variableName = ...
            variable: /^\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*=/,
            // Function definition: functionName = (...) => ...
            function: /^\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*\([^)]*\)\s*=>/,
            // Record definition: recordName = [...]
            record: /^\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*\[/
        };

        lines.forEach((line, index) => {
            // Check for function definitions
            const functionMatch = line.match(patterns.function);
            if (functionMatch) {
                symbols.push({
                    name: functionMatch[1],
                    type: 'function',
                    file,
                    line: index + 1,
                    documentation: this.extractDocumentation(lines, index)
                });
                return;
            }

            // Check for record definitions
            const recordMatch = line.match(patterns.record);
            if (recordMatch) {
                symbols.push({
                    name: recordMatch[1],
                    type: 'record',
                    file,
                    line: index + 1,
                    documentation: this.extractDocumentation(lines, index),
                    fields: this.extractRecordFields(lines, index)
                });
                return;
            }

            // Check for variable assignments
            const variableMatch = line.match(patterns.variable);
            if (variableMatch && !functionMatch && !recordMatch) {
                symbols.push({
                    name: variableMatch[1],
                    type: 'variable',
                    file,
                    line: index + 1,
                    documentation: this.extractDocumentation(lines, index)
                });
            }
        });

        return symbols;
    }

    private extractDocumentation(lines: string[], currentLine: number): string | undefined {
        // Look for comments above the current line
        let docLine = currentLine - 1;
        const docLines: string[] = [];

        while (docLine >= 0) {
            const line = lines[docLine].trim();
            if (line.startsWith('//')) {
                docLines.unshift(line.substring(2).trim());
                docLine--;
            } else if (line === '') {
                docLine--;
            } else {
                break;
            }
        }

        return docLines.length > 0 ? docLines.join(' ') : undefined;
    }

    private extractRecordFields(lines: string[], recordStartLine: number): Array<{name: string; type: string; description?: string}> | undefined {
        const fields: Array<{name: string; type: string; description?: string}> = [];
        let currentLine = recordStartLine + 1;
        let bracketCount = 1;
        let inRecord = true;

        while (currentLine < lines.length && inRecord) {
            const line = lines[currentLine].trim();
            
            // Track bracket nesting
            bracketCount += (line.match(/\[/g) || []).length;
            bracketCount -= (line.match(/\]/g) || []).length;
            
            if (bracketCount <= 0) {
                break;
            }

            // Simple field pattern: FieldName = value
            const fieldMatch = line.match(/^\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*(.+)$/);
            if (fieldMatch) {
                fields.push({
                    name: fieldMatch[1],
                    type: this.inferType(fieldMatch[2]),
                    description: this.extractDocumentation(lines, currentLine)
                });
            }

            currentLine++;
        }

        return fields.length > 0 ? fields : undefined;
    }

    private inferType(value: string): string {
        value = value.trim();
        
        if (value.startsWith('"') && value.endsWith('"')) {
            return 'text';
        }
        if (value === 'true' || value === 'false') {
            return 'logical';
        }
        if (/^\d+$/.test(value)) {
            return 'number';
        }
        if (/^\d+\.\d+$/.test(value)) {
            return 'number';
        }
        if (value.startsWith('[') && value.endsWith(']')) {
            return 'record';
        }
        if (value.startsWith('{') && value.endsWith('}')) {
            return 'list';
        }
        if (value.includes('=>')) {
            return 'function';
        }
        
        return 'any';
    }

    public dispose(): void {
        this._onDidChangeFiles.dispose();
        if (this.fileWatcher) {
            this.fileWatcher.dispose();
        }
    }
}