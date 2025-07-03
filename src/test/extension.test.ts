// src/test/extension.test.ts - Enhanced test suite
import * as assert from 'assert';
import * as vscode from 'vscode';

suite('Extension Test Suite', () => {
    vscode.window.showInformationMessage('Start all tests.');

    test('Extension should be present', () => {
        assert.ok(vscode.extensions.getExtension('ken-willis.pq-workspace-devkit'));
    });

    test('Extension should activate', async () => {
        const extension = vscode.extensions.getExtension('ken-willis.pq-workspace-devkit');
        if (extension) {
            await extension.activate();
            assert.strictEqual(extension.isActive, true);
        }
    });

    test('All commands should be registered', async () => {
        const commands = await vscode.commands.getCommands();
        const expectedCommands = [
            'pq-workspace-devkit.refresh',
            'pq-workspace-devkit.generateTestSymbols',
            'pq-workspace-devkit.cleanup',
            'pq-workspace-devkit.configure',
            'pq-workspace-devkit.status'
        ];
        
        expectedCommands.forEach(cmd => {
            assert.ok(commands.includes(cmd), `Command ${cmd} not found`);
        });
    });

    test('Refresh command should execute', async () => {
        // Test command execution
        await vscode.commands.executeCommand('pq-workspace-devkit.refresh');
        // Command should complete without throwing
    });

    test('Package.json should have required fields', () => {
        const packageJson = require('../../package.json');
        assert.ok(packageJson.name);
        assert.ok(packageJson.displayName);
        assert.ok(packageJson.description);
        assert.ok(packageJson.version);
        assert.ok(packageJson.engines.vscode);
        assert.ok(packageJson.activationEvents);
        assert.ok(packageJson.contributes.commands);
        assert.ok(packageJson.contributes.configuration);
    });

    test('Configuration schema should be valid', () => {
        const packageJson = require('../../package.json');
        const config = packageJson.contributes.configuration;
        
        assert.ok(config.properties['pq-workspace-devkit.fileExtensions']);
        assert.ok(config.properties['pq-workspace-devkit.symbolsDirectory']);
        assert.ok(config.properties['pq-workspace-devkit.autoGenerate']);
    });
});