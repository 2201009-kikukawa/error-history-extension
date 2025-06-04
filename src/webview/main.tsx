import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { VSCodeButton } from "@vscode/webview-ui-toolkit/react";

declare const acquireVsCodeApi: any;
const vscode = acquireVsCodeApi();

const main = () => {
  const [text, setText] = useState<string>("");
  const [errors, setErrors] = useState<any[]>([]);

  useEffect(() => {
    window.addEventListener("message", (event) => {
      const { type, data } = event.data;
      if (type === "showErrors") {
        setErrors(data);
      }
    });
  }, []);

  return (
    <>
      <VSCodeButton onClick={() => setText("ボタンがクリックされました")}>ボタン</VSCodeButton>
      <div>{text}</div>

      <div style={{ marginTop: "1rem" }}>
        <h3>🔍 エラー情報</h3>
        {errors.length === 0 ? (
          <p>エラーはありません。</p>
        ) : (
          <ul>
            {errors.map((err, i) => (
              <li key={i} style={{ marginBottom: "0.5rem" }}>
                <strong>[{err.severity}]</strong> {err.message} <br />
                <small>行 {err.line}, 列 {err.character}（{err.source}）</small>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default main;

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(React.createElement(main));
