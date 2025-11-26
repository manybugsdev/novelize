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
      const [inkjs, mainjs, storyjs] = ["ink", "main", "story"].map((name) =>
        panel.webview.asWebviewUri(vscode.Uri.joinPath(dirPath, name + ".js"))
      );
      vscode.window.showInformationMessage(html([inkjs, mainjs, storyjs]));
      console.log(html([inkjs, mainjs, storyjs]));
      panel.webview.html = html([inkjs, mainjs, storyjs]);
    })
  );
}

function html(scripts: vscode.Uri[]) {
  return `
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">

    <title>The Intercept</title>

    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <link rel="stylesheet" href="style.css">

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
