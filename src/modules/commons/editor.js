import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-c";
import "prismjs/components/prism-cpp";
import "prismjs/components/prism-java";
import "prismjs/components/prism-javascript";
import "prismjs/themes/prism.css";
import { useState } from "react";
import "./assets/editor.css";

export default function CodeEditor() {
  const [code, setCode] = useState("");
  const [size, setSize] = useState(14);
  const [language, setLanguage] = useState(languages.js);
  const hightlightWithLineNumbers = (input, language) =>
    highlight(input, language)
      .split("\n")
      .map((line, i) => `<span class='editorLineNumber'>${i + 1}</span>${line}`)
      .join("\n");
  return (
    <>
      <div class="row mt-2">
        <div
          class="w-100 p-0 px-5 d-flex justify-content-end align-items-center py-2 m-0 text-white"
          style={{ backgroundColor: "#120851" }}
        >
          <p class="px-2 m-0">Set font size</p>
          <input type="number" class="editor-size" placeholder={size}></input>
          <p class="px-2 ps-4 m-0">Set language</p>
          <select
            defaultValue={"javascript"}
            style={{ fontSize: "14px" }}
            class="px-2"
          >
            <option>javascript</option>
            <option>java</option>
            <option>c/cpp</option>
          </select>
        </div>
        <div
          class="editor-tool-bar col-12 p-0"
          style={{ backgroundColor: "#f5f6f8" }}
        >
          <Editor
            value={code}
            onValueChange={(code) => setCode(code)}
            placeholder={"// Your code here !"}
            highlight={(code) => hightlightWithLineNumbers(code, language)}
            padding={10}
            textareaId="codeArea"
            className="editor"
            style={{
              fontFamily: '"Fira code", "Fira Mono", monospace',
              fontSize: size || 14,
              minHeight: 500,
              width: "100%",
              outline: 0,
            }}
          />
        </div>
      </div>
    </>
  );
}
