// src/fileScanner.ts
// PQ Workspace DevKit - File Scanner
// Discovers and tracks Power Query files in workspace

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

import { PowerQueryParser } from './parserIntegration';

export class FileScanner {
    private _onDidChangeFiles = new vscode.EventEmitter<PowerQueryFile[]>();
    public readonly onDidChangeFiles = this._onDidChangeFiles.event;

    private discoveredFiles: Map<string, PowerQueryFile> = new Map();
    private fileWatcher?: vscode.FileSystemWatcher;
    private workspaceRoot?: string;
    private parser: PowerQueryParser;

    constructor(private context: vscode.ExtensionContext) {
        this.setupWorkspaceRoot();
        this.setupFileWatcher();
        this.parser = new PowerQueryParser();
    }

    private setupWorkspaceRoot(): void {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (workspaceFolders && workspaceFolders.length > 0) {
            this.workspaceRoot = workspaceFolders[0].uri.fsPath;
        }
    }

    private setupFileWatcher(): void {
        // Watch for Power Query files based on configured extensions
        const config = this.getConfiguredExtensions();
        const globPattern = `**/*{${config.join(',')}}`;
        this.fileWatcher = vscode.workspace.createFileSystemWatcher(globPattern);
        
        this.fileWatcher.onDidCreate(uri => this.handleFileChange(uri, 'created'));
        this.fileWatcher.onDidChange(uri => this.handleFileChange(uri, 'changed'));
        this.fileWatcher.onDidDelete(uri => this.handleFileChange(uri, 'deleted'));

        this.context.subscriptions.push(this.fileWatcher);
    }

    private getConfiguredExtensions(): string[] {
        const config = vscode.workspace.getConfiguration('pq-workspace-devkit');
        return config.get<string[]>('fileExtensions', ['.pq', '.pqout', '.pqm', '.m', '.mout']);
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
        const config = this.getConfiguredExtensions();
        const globPattern = `**/*{${config.join(',')}}`;
        const files = await vscode.workspace.findFiles(globPattern, '**/node_modules/**');
        
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
        
        // Use Microsoft's parser for accurate symbol extraction
        return await this.parser.parseAndExtractSymbols(content, file);
    }

    public dispose(): void {
        this._onDidChangeFiles.dispose();
        if (this.fileWatcher) {
            this.fileWatcher.dispose();
        }
    }
}