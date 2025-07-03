// src/extension.ts
// Power Query Cross-Reference Extension - Main Entry Point
// Orchestrates file scanning, symbol generation, and Microsoft integration

import * as vscode from 'vscode';
import { FileScanner } from './fileScanner';
import { ConfigurationManager } from './configuration';
import { SymbolGenerator } from './symbolGenerator';

let fileScanner: FileScanner;
let configManager: ConfigurationManager;
let symbolGenerator: SymbolGenerator;

export function activate(context: vscode.ExtensionContext) {
    console.log('PQ Workspace DevKit extension activated');

    // Initialize core components
    configManager = new ConfigurationManager(context);
    fileScanner = new FileScanner(context);
    symbolGenerator = new SymbolGenerator(configManager);

    // Register commands
    registerCommands(context);

    // Setup automatic symbol generation
    setupAutoGeneration();

    // Check for Microsoft Power Query extension
    checkMicrosoftExtension();

    // Initial workspace scan if auto-generate is enabled
    if (configManager.shouldAutoGenerate()) {
        void initializeWorkspace();
    }

    configManager.log('Extension initialization complete');
}

function registerCommands(context: vscode.ExtensionContext): void {
    // Main command to refresh/generate symbols
    const refreshCommand = vscode.commands.registerCommand(
        'pq-workspace-devkit.refresh',
        async () => {
            await refreshSymbols();
        }
    );

    // Command to generate test symbols
    const testSymbolsCommand = vscode.commands.registerCommand(
        'pq-workspace-devkit.generateTestSymbols',
        async () => {
            await symbolGenerator.generateTestSymbols();
        }
    );

    // Command to clean up symbol files
    const cleanupCommand = vscode.commands.registerCommand(
        'pq-workspace-devkit.cleanup',
        async () => {
            await symbolGenerator.cleanupSymbolFiles();
            configManager.showStatus('Symbol files cleaned up');
        }
    );

    // Command to configure Microsoft extension
    const configureCommand = vscode.commands.registerCommand(
        'pq-workspace-devkit.configure',
        async () => {
            await configManager.configureMicrosoftExtension();
        }
    );

    // Command to show status/info
    const statusCommand = vscode.commands.registerCommand(
        'pq-workspace-devkit.status',
        async () => {
            await showExtensionStatus();
        }
    );

    context.subscriptions.push(
        refreshCommand,
        testSymbolsCommand,
        cleanupCommand,
        configureCommand,
        statusCommand
    );
}

function setupAutoGeneration(): void {
    // Listen for file changes
    fileScanner.onDidChangeFiles(async (files) => {
        if (configManager.shouldAutoGenerate()) {
            await generateSymbolsFromFiles(files);
        }
    });

    // Listen for file saves
    vscode.workspace.onDidSaveTextDocument(async (document) => {
        if (configManager.shouldUpdateOnSave() && 
            configManager.isFileSupported(document.fileName)) {
            
            // Trigger refresh after a short delay to allow file system to update
            setTimeout(() => {
                void refreshSymbols();
            }, 500);
        }
    });
}

async function checkMicrosoftExtension(): Promise<void> {
    if (!configManager.isMicrosoftExtensionInstalled()) {
        await configManager.promptInstallMicrosoftExtension();
    } else {
        // Configure Microsoft extension to use our symbols
        await configManager.configureMicrosoftExtension();
    }
}

async function initializeWorkspace(): Promise<void> {
    try {
        configManager.showStatus('Scanning workspace for Power Query files...');
        
        const files = await fileScanner.scanWorkspace();
        
        if (files.length > 0) {
            configManager.log(`Found ${files.length} Power Query files`);
            await generateSymbolsFromFiles(files);
        } else {
            configManager.log('No Power Query files found in workspace');
            configManager.showStatus('No Power Query files found', false);
        }
    } catch (error) {
        const message = `Failed to initialize workspace: ${error}`;
        configManager.log(message);
        vscode.window.showErrorMessage(message);
    }
}

async function refreshSymbols(): Promise<void> {
    try {
        configManager.showStatus('Refreshing Power Query symbols...');
        
        // Re-scan workspace
        const files = await fileScanner.scanWorkspace();
        await generateSymbolsFromFiles(files);
        
        configManager.showStatus(`Refreshed symbols for ${files.length} files`, false);
    } catch (error) {
        const message = `Failed to refresh symbols: ${error}`;
        configManager.log(message);
        vscode.window.showErrorMessage(message);
    }
}

async function generateSymbolsFromFiles(files: Array<any>): Promise<void> {
    try {
        const allSymbols = [];
        
        for (const file of files) {
            const symbols = await fileScanner.extractSymbols(file);
            allSymbols.push(...symbols);
        }
        
        if (allSymbols.length > 0) {
            await symbolGenerator.generateSymbolFiles(allSymbols);
            configManager.log(`Generated symbols for ${allSymbols.length} definitions`);
        }
    } catch (error) {
        const message = `Failed to generate symbols: ${error}`;
        configManager.log(message);
        vscode.window.showErrorMessage(message);
    }
}

async function showExtensionStatus(): Promise<void> {
    const files = fileScanner.getDiscoveredFiles();
    const config = configManager.getConfiguration();
    const symbolsDir = configManager.getSymbolsDirectory();
    const hasMicrosoft = configManager.isMicrosoftExtensionInstalled();
    
    const statusItems = [
        `📁 Workspace Files: ${files.length}`,
        `🔧 Symbols Directory: ${symbolsDir}`,
        `⚙️ Auto Generate: ${config.autoGenerate ? 'Enabled' : 'Disabled'}`,
        `💾 Update on Save: ${config.updateOnSave ? 'Enabled' : 'Disabled'}`,
        `🔌 Microsoft Extension: ${hasMicrosoft ? 'Installed' : 'Not Installed'}`,
        `📝 Logging: ${config.enableLogging ? 'Enabled' : 'Disabled'}`
    ];
    
    const message = statusItems.join('\n');
    
    vscode.window.showInformationMessage(
        'PQ Workspace DevKit Status',
        { modal: true, detail: message }
    );
}

export function deactivate(): Promise<void> {
    configManager?.log('Extension deactivating');
    
    // Cleanup resources
    fileScanner?.dispose();
    
    return Promise.resolve();
}