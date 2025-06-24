// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('{{extensionDisplayName}} extension activated - ready for development!');

    // Optional: Log extension info for debugging
    console.log(`Extension path: ${context.extensionPath}`);

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('{{extensionName}}.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from {{extensionDisplayName}}!');
	});

	// Example to add a second command, which must have an entry in package.json
	// This command shows a status bar message for 2 seconds
	/* 

	const statusBarCommand = vscode.commands.registerCommand('{{extensionName}}.showStatus', () => {
		vscode.window.setStatusBarMessage('{{extensionDisplayName}} working!', 2000);
	});

	*/

	context.subscriptions.push(disposable);

	// Or to push both the helloWorld and showStatus commands at once
	// context.subscriptions.push(disposable, statusBarCommand);
}

// This method is called when your extension is deactivated
export function deactivate() {}