// src/configuration.ts
// Power Query Cross-Reference Extension - Configuration Manager
// Manages extension settings and Microsoft Power Query integration

import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

export interface ExtensionConfiguration {
    fileExtensions: string[];
    symbolsDirectory: string;
    autoGenerate: boolean;
    excludePatterns: string[];
    enableLogging: boolean;
    updateOnSave: boolean;
}

export class ConfigurationManager {
    private static readonly EXTENSION_ID = 'pq-workspace-devkit';
    private static readonly SYMBOLS_DIR_NAME = '.pq-symbols';
    private workspaceRoot?: string;

    constructor(private context: vscode.ExtensionContext) {
        this.setupWorkspaceRoot();
        this.watchConfiguration();
    }

    private setupWorkspaceRoot(): void {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (workspaceFolders && workspaceFolders.length > 0) {
            this.workspaceRoot = workspaceFolders[0].uri.fsPath;
        }
    }

    private watchConfiguration(): void {
        vscode.workspace.onDidChangeConfiguration(event => {
            if (event.affectsConfiguration(ConfigurationManager.EXTENSION_ID)) {
                this.onConfigurationChanged();
            }
        });
    }

    private onConfigurationChanged(): void {
        // Notify other components that configuration has changed
        vscode.commands.executeCommand('pq-workspace-devkit.refresh');
    }

    public getConfiguration(): ExtensionConfiguration {
        const config = vscode.workspace.getConfiguration(ConfigurationManager.EXTENSION_ID);
        
        return {
            fileExtensions: config.get<string[]>('fileExtensions', ['.pq', '.m', '.pqm']),
            symbolsDirectory: this.getSymbolsDirectory(),
            autoGenerate: config.get<boolean>('autoGenerate', true),
            excludePatterns: config.get<string[]>('excludePatterns', ['**/node_modules/**', '**/.git/**']),
            enableLogging: config.get<boolean>('enableLogging', false),
            updateOnSave: config.get<boolean>('updateOnSave', true)
        };
    }

    public getSymbolsDirectory(): string {
        const config = vscode.workspace.getConfiguration(ConfigurationManager.EXTENSION_ID);
        const customDir = config.get<string>('symbolsDirectory');
        
        if (customDir) {
            return path.isAbsolute(customDir) ? customDir : path.join(this.workspaceRoot || '', customDir);
        }
        
        return path.join(this.workspaceRoot || '', ConfigurationManager.SYMBOLS_DIR_NAME);
    }

    public async ensureSymbolsDirectory(): Promise<string> {
        const symbolsDir = this.getSymbolsDirectory();
        
        try {
            if (!fs.existsSync(symbolsDir)) {
                fs.mkdirSync(symbolsDir, { recursive: true });
                this.log(`Created symbols directory: ${symbolsDir}`);
            }
            return symbolsDir;
        } catch (error) {
            const message = `Failed to create symbols directory: ${error}`;
            this.log(message);
            vscode.window.showErrorMessage(message);
            throw error;
        }
    }

    public async configureMicrosoftExtension(): Promise<void> {
        const symbolsDir = await this.ensureSymbolsDirectory();
        
        try {
            // Get current Microsoft Power Query configuration
            const powerQueryConfig = vscode.workspace.getConfiguration('powerquery.client');
            const currentDirs = powerQueryConfig.get<string[]>('additionalSymbolsDirectories', []);
            
            // Add our symbols directory if not already present
            if (!currentDirs.includes(symbolsDir)) {
                const updatedDirs = [...currentDirs, symbolsDir];
                await powerQueryConfig.update(
                    'additionalSymbolsDirectories', 
                    updatedDirs, 
                    vscode.ConfigurationTarget.Workspace
                );
                
                this.log(`Added symbols directory to Microsoft Power Query extension: ${symbolsDir}`);
                vscode.window.showInformationMessage(
                    'PQ Workspace DevKit: Symbol directory configured successfully!'
                );
            }
        } catch (error) {
            const message = `Failed to configure Microsoft Power Query extension: ${error}`;
            this.log(message);
            vscode.window.showWarningMessage(message);
        }
    }

    public async removeMicrosoftConfiguration(): Promise<void> {
        const symbolsDir = this.getSymbolsDirectory();
        
        try {
            const powerQueryConfig = vscode.workspace.getConfiguration('powerquery.client');
            const currentDirs = powerQueryConfig.get<string[]>('additionalSymbolsDirectories', []);
            
            const filteredDirs = currentDirs.filter(dir => dir !== symbolsDir);
            
            if (filteredDirs.length !== currentDirs.length) {
                await powerQueryConfig.update(
                    'additionalSymbolsDirectories', 
                    filteredDirs, 
                    vscode.ConfigurationTarget.Workspace
                );
                
                this.log(`Removed symbols directory from Microsoft Power Query extension: ${symbolsDir}`);
            }
        } catch (error) {
            this.log(`Failed to remove Microsoft configuration: ${error}`);
        }
    }

    public isMicrosoftExtensionInstalled(): boolean {
        const extension = vscode.extensions.getExtension('PowerQuery.vscode-powerquery');
        return extension !== undefined;
    }

    public async promptInstallMicrosoftExtension(): Promise<void> {
        const choice = await vscode.window.showInformationMessage(
            'PQ Workspace DevKit works best with Microsoft\'s Power Query extension. Would you like to install it?',
            'Install', 'Later'
        );
        
        if (choice === 'Install') {
            vscode.commands.executeCommand('extension.open', 'PowerQuery.vscode-powerquery');
        }
    }

    public getFileExtensions(): string[] {
        return this.getConfiguration().fileExtensions;
    }

    public isFileSupported(filePath: string): boolean {
        const ext = path.extname(filePath).toLowerCase();
        return this.getFileExtensions().includes(ext);
    }

    public shouldAutoGenerate(): boolean {
        return this.getConfiguration().autoGenerate;
    }

    public shouldUpdateOnSave(): boolean {
        return this.getConfiguration().updateOnSave;
    }

    public getExcludePatterns(): string[] {
        return this.getConfiguration().excludePatterns;
    }

    public log(message: string): void {
        if (this.getConfiguration().enableLogging) {
            console.log(`[PQ Workspace DevKit] ${message}`);
        }
    }

    public async showStatus(message: string, hideAfterTimeout = true): Promise<void> {
        if (hideAfterTimeout) {
            vscode.window.setStatusBarMessage(`$(sync~spin) ${message}`, 3000);
        } else {
            vscode.window.setStatusBarMessage(`$(check) ${message}`);
        }
    }

    public static getConfigurationSchema() {
        return {
            type: 'object',
            title: 'PQ Workspace DevKit',
            properties: {
                [`${ConfigurationManager.EXTENSION_ID}.fileExtensions`]: {
                    type: 'array',
                    items: { type: 'string' },
                    default: ['.pq', '.m', '.pqm'],
                    description: 'File extensions to scan for Power Query symbols'
                },
                [`${ConfigurationManager.EXTENSION_ID}.symbolsDirectory`]: {
                    type: 'string',
                    default: '',
                    description: 'Custom directory for generated symbol files (relative to workspace root)'
                },
                [`${ConfigurationManager.EXTENSION_ID}.autoGenerate`]: {
                    type: 'boolean',
                    default: true,
                    description: 'Automatically generate symbol files when workspace opens'
                },
                [`${ConfigurationManager.EXTENSION_ID}.excludePatterns`]: {
                    type: 'array',
                    items: { type: 'string' },
                    default: ['**/node_modules/**', '**/.git/**'],
                    description: 'Glob patterns to exclude from symbol scanning'
                },
                [`${ConfigurationManager.EXTENSION_ID}.enableLogging`]: {
                    type: 'boolean',
                    default: false,
                    description: 'Enable debug logging to console'
                },
                [`${ConfigurationManager.EXTENSION_ID}.updateOnSave`]: {
                    type: 'boolean',
                    default: true,
                    description: 'Update symbol files automatically when Power Query files are saved'
                }
            }
        };
    }
}