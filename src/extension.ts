import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Function to check if the current line in the active editor is part of a registered design pattern.
 * If it is, a warning message is displayed.
 */
function checkRecord() {
	console.log("checkrecord");
	const activeEditor = vscode.window.activeTextEditor;
	if (activeEditor) {
		const currentLine = activeEditor.selection.active.line + 1;

		const jsonFilePath = path.join( vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0
			? vscode.workspace.workspaceFolders[0].uri.fsPath : '','constraints.json');
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
function registerDesignPattern() {
	const activeEditor = vscode.window.activeTextEditor;
	if (activeEditor) {
		const selection = activeEditor.selection;
		const firstLine = selection.start.line + 1;
		const lastLine = selection.end.line + 1;

		vscode.window.showInputBox({ prompt: 'Enter the name of the dsign pattern to register' , title: 'Register the design pattern'}).then((key) => {
			if (key) {
				const filePath = activeEditor.document.uri.fsPath;
				const data = {
					filePath,
					firstLine,
					lastLine
				};

				const jsonFilePath = path.join( vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0
					? vscode.workspace.workspaceFolders[0].uri.fsPath : '','constraints.json');
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

function detectSingleton() {
	const singletonRegex = /class\s+(\w+)\s*\{[\s\S]*private\s+static\s+\1\s+\w+\s*;/;
	const activeEditor = vscode.window.activeTextEditor;

	if (activeEditor) {
		const documentText = activeEditor.document.getText();
		console.log(singletonRegex.test(documentText));
		if (singletonRegex.test(documentText)) {
			vscode.window.showInformationMessage('Possible Singleton pattern detected. Do you want to register it?', 'Yes', 'No')
				.then((answer) => {
					if (answer === 'Yes') {
						const matches = documentText.match(singletonRegex);
						if (matches) {
							const range = new vscode.Range(
								activeEditor.document.positionAt(matches.index || 0),
								activeEditor.document.positionAt((matches.index || 0) + matches[0].length)
							);
							// Rest of the code...

							let firstLine = 0;
							let lastLine = 0;

						if (range) {
							// then you can get the word that's there:
							const word = activeEditor.document.getText(range); // get the word at the range
						
							// Highlight the selection:
							activeEditor.selection = new vscode.Selection(range.start, range.end)

							firstLine = range.start.line+1;
							lastLine = range.end.line+1;
						}

						vscode.window.showInputBox({ prompt: 'Enter the name of the design pattern to register', title: 'Register the design pattern' }).then((key) => {
							if (key) {
								const filePath = activeEditor.document.uri.fsPath;
								const data = {
									filePath,
									firstLine,
									lastLine
								};

								const jsonFilePath = path.join(vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0
									? vscode.workspace.workspaceFolders[0].uri.fsPath : '', 'constraints.json');
								let jsonData: any = {};
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
				}}); 
		}
	}
}

/**
 * This method is called when the extension is activated.
 * It registers the commands and events used by the extension.
 */
export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "architecture-constraints-tracer" is now active!');
	checkRecord();
	detectSingleton();

	let disposable = vscode.commands.registerCommand('architecture-constraints-tracer.helloWorld', () => {
		vscode.window.showInformationMessage('Hello World from architecture-constraints-tracer!');
	});

	let disposableRegisterCommand = vscode.commands.registerCommand('architecture-constraints-tracer.registerDesignPattern', function () {
		registerDesignPattern();
	});

	let disposableCheckRecordEvent = vscode.window.onDidChangeTextEditorSelection(() => {
		checkRecord();
	});

	context.subscriptions.push(disposable, disposableRegisterCommand, disposableCheckRecordEvent);
	const singletonRegex = /class\s+(\w+)\s*{[\s\S]*private\s+static\s+\w+\s+\w+\s*;[\s\S]*private\s+\w+\s*\(\s*\)\s*{\s*}[\s\S]*public\s+static\s+\w+\s+\w+\(\)\s*{\s*if\s*\(\s*\w+\s*==\s*null\s*\)\s*{\s*\w+\s*=\s*new\s+\w+\s*\(\s*\)\s*;\s*}\s*return\s*\w+\s*;\s*}[\s\S]*}/;

	// Call checkRecord immediately when the extension is activated
}
//  vscode.languages.registerHoverProvider('java', {
//         provideHover(document, position, token) {

//             const range = document.getWordRangeAtPosition(position);
//             const word = document.getText(range);

//             if (word == "public") {

//                 return new vscode.Hover({
//                     language: "java language",
//                     value: "This is a fuction that return a static value.	"
//                 });
//             }
//         }
//     });

/**
 * This method is called when your extension is deactivated.
 */
export function deactivate() {}