import { ExtensionContext, window, commands, languages, DiagnosticSeverity, WebviewView } from "vscode";
import { ViewProvider } from "./providers/ViewProvider";

let webviewView: WebviewView | null = null;

export function activate(context: ExtensionContext) {
  const outputChannel = window.createOutputChannel("Error Check");

  const provider = new ViewProvider(context.extensionUri, (view) => {
    webviewView = view;
  });

  const webviewViewDisposable = window.registerWebviewViewProvider(ViewProvider.viewType, provider);

  const showErrorsCommand = commands.registerCommand("extension.errorCheck", async () => {
    const editor = window.activeTextEditor;
    outputChannel.clear();
    outputChannel.show();

    if (!editor) {
      const msg = "アクティブなテキストエディタが見つかりません。";
      outputChannel.appendLine(msg);
      window.showInformationMessage(msg);
      return;
    }

    const diagnostics = languages.getDiagnostics(editor.document.uri);

    if (!diagnostics || diagnostics.length === 0) {
      const msg = `ファイル ${editor.document.uri.fsPath} にエラーはありません。`;
      outputChannel.appendLine(msg);
      window.showInformationMessage("エラーは見つかりませんでした。");
      webviewView?.webview.postMessage({ type: "showErrors", data: [] });
    } else {
      const errorList = diagnostics.map((diagnostic) => ({
        severity: DiagnosticSeverity[diagnostic.severity] || "Unknown",
        message: diagnostic.message,
        source: diagnostic.source || "不明",
        line: diagnostic.range.start.line + 1,
        character: diagnostic.range.start.character + 1,
      }));

      webviewView?.webview.postMessage({ type: "showErrors", data: errorList });

      outputChannel.appendLine(`=== エラー情報 ===`);
      diagnostics.forEach((d, i) => {
        const icon = ["❌", "⚠️", "ℹ️", "💡"][d.severity] || "❓";
        outputChannel.appendLine(`${i + 1}. ${icon} [${DiagnosticSeverity[d.severity]}]`);
        outputChannel.appendLine(`   メッセージ: ${d.message}`);
        outputChannel.appendLine(`   ソース: ${d.source || "不明"}`);
        outputChannel.appendLine(`   位置: 行 ${d.range.start.line + 1}, 列 ${d.range.start.character + 1}`);
        outputChannel.appendLine("");
      });

      window.showInformationMessage(`エラー情報を取得しました（${diagnostics.length}件）`);
    }
  });

  context.subscriptions.push(webviewViewDisposable, showErrorsCommand, outputChannel);
}
