import * as vscode from "vscode";
import { exec } from "child_process";

const PROJECT_DIR = "C:\\Users\\hp\\sql-validator";
const PYTHON_PATH = "C:\\Users\\hp\\sql-validator\\env\\Scripts\\python.exe";


export function activate(context: vscode.ExtensionContext) {

    const output = vscode.window.createOutputChannel("SQL Validator");
    context.subscriptions.push(output);

    const diagnostics = vscode.languages.createDiagnosticCollection("sqlvalidator");
    context.subscriptions.push(diagnostics);

    vscode.workspace.onDidChangeTextDocument((event) => {
        const doc = event.document;
        if (doc.languageId !== "python") return;

        const filePath = doc.fileName.replace(/\\/g, "/");
        const cmd = `${PYTHON_PATH} -m src.cli check "${filePath}" --json-output`;

        exec(cmd, { cwd: PROJECT_DIR }, (err, stdout, stderr) => {

            output.clear();
            output.appendLine("Running SQL Validator...");
            output.appendLine(`Command: ${cmd}`);

            if (stderr) {
                output.appendLine("STDERR:");
                output.appendLine(stderr);
            }

            if (err) {
                output.appendLine("EXEC ERROR:");
                output.appendLine(err.message);
            }

            output.appendLine("STDOUT:");
            output.appendLine(stdout);

            if (err || stderr || !stdout.trim().startsWith("{")) {
                diagnostics.set(doc.uri, []);
                return;
            }


            let data;
            try { data = JSON.parse(stdout); } 
            catch { return diagnostics.set(doc.uri, []); }

            const errors = data.errors || [];
            const diagList: vscode.Diagnostic[] = [];

            for (const issue of errors) {

                const offending = issue.offending;
                if (!offending) continue;

                let foundLine = -1;
                let startCol = -1;

                // 1️⃣ Try reported line first (safe)
                if (typeof issue.line === "number") {
                    const l = issue.line - 1;
                    if (l >= 0 && l < doc.lineCount) {
                        const text = doc.lineAt(l).text;
                        const idx = text.indexOf(offending);
                        if (idx !== -1) {
                            foundLine = l;
                            startCol = idx;
                        }
                    }
                }

                // 2️⃣ Fallback: search entire document
                if (startCol === -1) {
                    for (let i = 0; i < doc.lineCount; i++) {
                        const text = doc.lineAt(i).text;
                        const idx = text.indexOf(offending);
                        if (idx !== -1) {
                            foundLine = i;
                            startCol = idx;
                            break;
                        }
                    }
                }

                if (startCol === -1)   continue; // skip only this issue

                const range = new vscode.Range(
                    foundLine,
                    startCol,
                    foundLine,
                    startCol + offending.length
                );

                const diag = new vscode.Diagnostic(
                    range,
                    `${issue.message}${issue.suggestion ? " → " + issue.suggestion : ""}`,
                    vscode.DiagnosticSeverity.Error
                );

                diagList.push(diag);
            }


            diagnostics.set(doc.uri, diagList);
        });
    });

    vscode.window.showInformationMessage("🟢 SQL Validator Ready — Live Errors Active");
}

export function deactivate() {}
