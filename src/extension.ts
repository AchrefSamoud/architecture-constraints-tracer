// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

function checkRecord() {
    const activeEditor = vscode.window.activeTextEditor;
    if (activeEditor) {
        const currentLine = activeEditor.selection.active.line + 1;

        const jsonFilePath = path.join( vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0
            ? vscode.workspace.workspaceFolders[0].uri.fsPath : '','fileData.json');
        if (fs.existsSync(jsonFilePath)) {
            const jsonData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'));

            for (const key in jsonData) {
                for (const fileKey in jsonData[key]) {
                    const record = jsonData[key][fileKey];
                    if (record.filePath === activeEditor.document.uri.fsPath && currentLine >= record.firstLine && currentLine <= record.lastLine) {
                        vscode.window.showWarningMessage(`You are editing a registered design pattern: ${key}`);
                        break;
                    }
                }
            }
        }
    }
}

function makeFrame() {
    const activeEditor = vscode.window.activeTextEditor;
    if (activeEditor) {
        const selection = activeEditor.selection;
        const firstLine = selection.start.line + 1;
        const lastLine = selection.end.line + 1;

        vscode.window.showInputBox({ prompt: 'Enter design pattern to register' }).then((key) => {
            if (key) {
                const filePath = activeEditor.document.uri.fsPath;
                const data = {
                    filePath,
                    firstLine,
                    lastLine
                };

                const jsonFilePath = path.join( vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0
                    ? vscode.workspace.workspaceFolders[0].uri.fsPath : '','fileData.json');
                let jsonData : any= {};
                if (fs.existsSync(jsonFilePath)) {
                    jsonData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'));
                }

                if (!jsonData[key]) {
                    jsonData[key] = {};
                }

                jsonData[key][`file${Object.keys(jsonData[key]).length + 1}`] = data;

                fs.writeFileSync(jsonFilePath, JSON.stringify(jsonData, null, 2));
            }
        });
    }
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "architecture-constraints-tracer" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('architecture-constraints-tracer.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from architecture-constraints-tracer!');
	});

	let disposableRegisterCommand = vscode.commands.registerCommand('architecture-constraints-tracer.registerDesignPattern', function () {
        makeFrame();
    });
	vscode.window.onDidChangeTextEditorSelection(() => {
		checkRecord();
	});
	let disposableCheckRecordEvent = vscode.window.onDidChangeTextEditorSelection(() => {
		checkRecord();
	});
    context.subscriptions.push(disposable,disposableRegisterCommand,disposableCheckRecordEvent);
}

// This method is called when your extension is deactivated
export function deactivate() {}
