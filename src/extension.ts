import * as vscode from "vscode";

const getPath =
  (context: vscode.ExtensionContext, panel: vscode.WebviewPanel) =>
  (...path: string[]) =>
    panel.webview.asWebviewUri(
      vscode.Uri.joinPath(context.extensionUri, ...path)
    );

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand("novelize.novelize", async () => {
      const panel = vscode.window.createWebviewPanel(
        "novelize",
        "Novelize",
        vscode.ViewColumn.One,
        {
          enableScripts: true,
        }
      );
      const path = getPath(context, panel);
      const mainjs = path("dist", "main.js");
      panel.webview.html = html(mainjs);
    })
  );
}

function html(mainjs: vscode.Uri) {
  return `
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">

    <title>The Intercept</title>

    <meta name="viewport" content="width=device-width, initial-scale=1.0">

</head>

<body>
  <div id="root"></div>
  <script type="module" src="${mainjs}"></script>
</body>
</html>  
  `;
}
