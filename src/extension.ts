import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand("novelize.novelize", () => {
      const panel = vscode.window.createWebviewPanel(
        "novelize",
        "Novelize",
        vscode.ViewColumn.One,
        {}
      );
    })
  );
}
