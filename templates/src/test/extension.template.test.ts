// src/test/extension.test.ts - Enhanced test suite
import * as assert from 'assert';
import * as vscode from 'vscode';

suite('Extension Test Suite', () => {
    vscode.window.showInformationMessage('Start all tests.');

    test('Extension should be present', () => {
        assert.ok(vscode.extensions.getExtension('{{extensionPublisherID}}.{{extensionName}}'));
    });

    test('Extension should activate', async () => {
        const extension = vscode.extensions.getExtension('{{extensionPublisherID}}.{{extensionName}}');
        if (extension) {
            await extension.activate();
            assert.strictEqual(extension.isActive, true);
        }
    });

    test('Hello World command should be registered', async () => {
        const commands = await vscode.commands.getCommands();
        assert.ok(commands.includes('{{extensionName}}.helloWorld'));
    });

    test('Hello World command should execute', async () => {
        // Test command execution
        await vscode.commands.executeCommand('{{extensionName}}.helloWorld');
        // Command should complete without throwing
    });

    test('Package.json should have required fields', () => {
        const packageJson = require('../../package.json');
        assert.ok(packageJson.name);
        assert.ok(packageJson.displayName);
        assert.ok(packageJson.description);
        assert.ok(packageJson.version);
        assert.ok(packageJson.engines.vscode);
    });
});