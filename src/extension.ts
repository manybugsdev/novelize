import * as vscode from "vscode";

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
      // Get path to resource on disk
      const dirPath = vscode.Uri.joinPath(context.extensionUri, "client");
      const { stylecss, inkjs, mainjs, storyjs } = [
        "style.css",
        "ink.js",
        "main.js",
        "story.js",
      ].reduce(
        (obj, name) => ({
          ...obj,
          [name.replace(".", "")]: panel.webview.asWebviewUri(
            vscode.Uri.joinPath(dirPath, name)
          ),
        }),
        {} as Record<string, vscode.Uri>
      );
      panel.webview.html = html([stylecss], [inkjs, storyjs, mainjs]);
    })
  );
}

function html(styles: vscode.Uri[], scripts: vscode.Uri[]) {
  return `
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">

    <title>The Intercept</title>

    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    ${styles.map((src) => `<link rel="stylesheet" href="${src}">`).join("")}

</head>

<body>

    <div id="story" class="container">
        <h1>The Intercept</h1>
    </div>

    ${scripts.map((src) => `<script src="${src}"></script>`).join("")}
</body>
</html>  
  `;
}
