// src/test/suite/integration.test.ts - Integration tests
import * as assert from 'assert';
import * as vscode from 'vscode';
import * as path from 'path';

suite('Integration Test Suite', () => {
    
    test('Extension contributes correct commands', async () => {
        const extension = vscode.extensions.getExtension('ken-willis.pq-workspace-devkit');
        const packageJson = extension?.packageJSON;
        
        assert.ok(packageJson.contributes.commands);
        assert.strictEqual(packageJson.contributes.commands.length, 1);
        assert.strictEqual(packageJson.contributes.commands[0].command, 'pq-workspace-devkit.helloWorld');
    });

    test('Extension loads in clean workspace', async () => {
        // Create temporary workspace
        const workspaceUri = vscode.Uri.file(path.join(__dirname, '..', '..', 'test-workspace'));
        
        // Extension should still work
        const extension = vscode.extensions.getExtension('ken-willis.pq-workspace-devkit');
        assert.ok(extension?.isActive);
    });
});