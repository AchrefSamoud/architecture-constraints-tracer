import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Function to check if the current line in the active editor is part of a registered design pattern.
 * If it is, a warning message is displayed.
 */
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

/**
 * Function to register a design pattern.
 * The user is asked to enter a key for the design pattern.
 * The current selection in the active editor is registered under the entered key.
 */
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

/**
 * This method is called when the extension is activated.
 * It registers the commands and events used by the extension.
 */
export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "architecture-constraints-tracer" is now active!');

	let disposable = vscode.commands.registerCommand('architecture-constraints-tracer.helloWorld', () => {
		vscode.window.showInformationMessage('Hello World from architecture-constraints-tracer!');
	});

	let disposableRegisterCommand = vscode.commands.registerCommand('architecture-constraints-tracer.registerDesignPattern', function () {
		makeFrame();
	});

	let disposableCheckRecordEvent = vscode.window.onDidChangeTextEditorSelection(() => {
		checkRecord();
	});

	context.subscriptions.push(disposable, disposableRegisterCommand, disposableCheckRecordEvent);
}

/**
 * This method is called when your extension is deactivated.
 */
export function deactivate() {}