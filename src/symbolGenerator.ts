// src/symbolGenerator.ts
// PQ Workspace DevKit - Symbol Generator
// Generates Microsoft-compatible symbol files from Power Query code

import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { PowerQueryFile, PowerQuerySymbol } from './fileScanner';
import { ConfigurationManager } from './configuration';

export interface MicrosoftSymbolFile {
    name: string;
    documentation?: {
        description?: string;
        longDescription?: string;
        category?: string;
    };
    functionParameters?: Array<{
        name: string;
        type: string;
        isRequired: boolean;
        isNullable: boolean;
        caption?: string;
        description?: string;
        sampleValues?: any[];
        allowedValues?: any[];
        defaultValue?: any;
        fields?: Array<{
            name: string;
            type: string;
            isRequired: boolean;
            isNullable: boolean;
            description?: string;
        }>;
        enumNames?: string[];
        enumCaptions?: string[];
    }>;
    completionItemKind: number;
    isDataSource: boolean;
    type: string;
}

export class SymbolGenerator {
    constructor(
        private configManager: ConfigurationManager
    ) {}

    public async generateSymbolFiles(symbols: PowerQuerySymbol[]): Promise<void> {
        const symbolsDir = await this.configManager.ensureSymbolsDirectory();
        
        // Group symbols by file for better organization
        const symbolsByFile = this.groupSymbolsByFile(symbols);
        
        // Generate one symbol file per source file
        for (const [sourceFile, fileSymbols] of symbolsByFile) {
            await this.generateSymbolFile(sourceFile, fileSymbols, symbolsDir);
        }

        this.configManager.log(`Generated ${symbolsByFile.size} symbol files in ${symbolsDir}`);
    }

    private groupSymbolsByFile(symbols: PowerQuerySymbol[]): Map<PowerQueryFile, PowerQuerySymbol[]> {
        const grouped = new Map<PowerQueryFile, PowerQuerySymbol[]>();
        
        for (const symbol of symbols) {
            if (!grouped.has(symbol.file)) {
                grouped.set(symbol.file, []);
            }
            grouped.get(symbol.file)!.push(symbol);
        }
        
        return grouped;
    }

    private async generateSymbolFile(
        sourceFile: PowerQueryFile, 
        symbols: PowerQuerySymbol[], 
        symbolsDir: string
    ): Promise<void> {
        const baseName = path.basename(sourceFile.fileName, path.extname(sourceFile.fileName));
        const symbolFileName = `${baseName}.json`;
        const symbolFilePath = path.join(symbolsDir, symbolFileName);

        // Convert symbols to Microsoft format
        const microsoftSymbols: MicrosoftSymbolFile[] = symbols.map(symbol => 
            this.convertToMicrosoftFormat(symbol)
        );

        // Write as JSON array (Microsoft requires array format)
        const content = JSON.stringify(microsoftSymbols, null, 2);
        
        try {
            await fs.promises.writeFile(symbolFilePath, content, 'utf8');
            this.configManager.log(`Generated symbol file: ${symbolFilePath}`);
        } catch (error) {
            const message = `Failed to write symbol file ${symbolFilePath}: ${error}`;
            this.configManager.log(message);
            vscode.window.showErrorMessage(message);
        }
    }

    private convertToMicrosoftFormat(symbol: PowerQuerySymbol): MicrosoftSymbolFile {
        const microsoftSymbol: MicrosoftSymbolFile = {
            name: symbol.name,
            completionItemKind: this.getCompletionItemKind(symbol.type),
            isDataSource: false,
            type: this.mapPowerQueryType(symbol.type)
        };

        // Add documentation if available
        if (symbol.documentation) {
            microsoftSymbol.documentation = {
                description: symbol.documentation,
                category: this.getCategoryFromFile(symbol.file)
            };
        }

        // Add function parameters if it's a function
        if (symbol.type === 'function' && symbol.parameters) {
            microsoftSymbol.functionParameters = symbol.parameters.map(param => ({
                name: param.name,
                type: param.type,
                isRequired: param.isRequired,
                isNullable: param.isNullable,
                description: param.description
            }));
        }

        // Add record fields if it's a record
        if (symbol.type === 'record' && symbol.fields) {
            // For records, we create a functionParameters entry with fields
            microsoftSymbol.functionParameters = [{
                name: 'record',
                type: 'record',
                isRequired: true,
                isNullable: false,
                description: `${symbol.name} record fields`,
                fields: symbol.fields.map(field => ({
                    name: field.name,
                    type: field.type,
                    isRequired: true,
                    isNullable: false,
                    description: field.description
                }))
            }];
        }

        return microsoftSymbol;
    }

    private getCompletionItemKind(symbolType: 'function' | 'variable' | 'record'): number {
        // VS Code CompletionItemKind enum values
        switch (symbolType) {
            case 'function':
                return 2; // Function
            case 'variable':
                return 5; // Variable  
            case 'record':
                return 6; // Class (closest to record)
            default:
                return 0; // Text
        }
    }

    private mapPowerQueryType(symbolType: 'function' | 'variable' | 'record'): string {
        switch (symbolType) {
            case 'function':
                return 'function';
            case 'record':
                return 'record';
            case 'variable':
            default:
                return 'any';
        }
    }

    private getCategoryFromFile(file: PowerQueryFile): string {
        // Generate category based on relative path
        const dir = path.dirname(file.relativePath);
        const baseName = path.basename(file.fileName, path.extname(file.fileName));
        
        if (dir === '.') {
            return baseName;
        }
        
        return `${dir}/${baseName}`;
    }

    public async cleanupSymbolFiles(): Promise<void> {
        const symbolsDir = this.configManager.getSymbolsDirectory();
        
        try {
            if (fs.existsSync(symbolsDir)) {
                const files = await fs.promises.readdir(symbolsDir);
                const jsonFiles = files.filter(file => file.endsWith('.json'));
                
                for (const file of jsonFiles) {
                    await fs.promises.unlink(path.join(symbolsDir, file));
                }
                
                this.configManager.log(`Cleaned up ${jsonFiles.length} symbol files`);
            }
        } catch (error) {
            this.configManager.log(`Error cleaning up symbol files: ${error}`);
        }
    }

    public async generateTestSymbols(): Promise<void> {
        // Generate test symbols for development/debugging
        const testSymbols: MicrosoftSymbolFile[] = [
            {
                name: 'TestFunction',
                documentation: {
                    description: 'A test function for development',
                    longDescription: 'This is a longer description of the test function',
                    category: 'Test'
                },
                functionParameters: [
                    {
                        name: 'input',
                        type: 'text',
                        isRequired: true,
                        isNullable: false,
                        description: 'Input text parameter'
                    },
                    {
                        name: 'options',
                        type: 'record',
                        isRequired: false,
                        isNullable: true,
                        description: 'Optional configuration record',
                        fields: [
                            {
                                name: 'testMode',
                                type: 'logical',
                                isRequired: false,
                                isNullable: false,
                                description: 'Enable test mode'
                            },
                            {
                                name: 'timeout',
                                type: 'number',
                                isRequired: false,
                                isNullable: false,
                                description: 'Timeout in seconds'
                            }
                        ]
                    }
                ],
                completionItemKind: 2,
                isDataSource: false,
                type: 'function'
            },
            {
                name: 'TestRecord',
                documentation: {
                    description: 'A test record for development',
                    category: 'Test'
                },
                functionParameters: [
                    {
                        name: 'record',
                        type: 'record',
                        isRequired: true,
                        isNullable: false,
                        description: 'Test record fields',
                        fields: [
                            {
                                name: 'name',
                                type: 'text',
                                isRequired: true,
                                isNullable: false,
                                description: 'Name field'
                            },
                            {
                                name: 'value',
                                type: 'number',
                                isRequired: true,
                                isNullable: false,
                                description: 'Value field'
                            }
                        ]
                    }
                ],
                completionItemKind: 6,
                isDataSource: false,
                type: 'record'
            }
        ];

        const symbolsDir = await this.configManager.ensureSymbolsDirectory();
        const testFilePath = path.join(symbolsDir, 'test-symbols.json');
        
        try {
            await fs.promises.writeFile(
                testFilePath, 
                JSON.stringify(testSymbols, null, 2), 
                'utf8'
            );
            
            this.configManager.log(`Generated test symbols: ${testFilePath}`);
            vscode.window.showInformationMessage('Test symbols generated successfully!');
        } catch (error) {
            const message = `Failed to generate test symbols: ${error}`;
            this.configManager.log(message);
            vscode.window.showErrorMessage(message);
        }
    }
}