import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-c";
import "prismjs/components/prism-cpp";
import "prismjs/components/prism-java";
import "prismjs/components/prism-javascript";
import "prismjs/themes/prism.css";
import { useEffect, useState } from "react";
import "./assets/editor.css";

export default function CodeEditor(props) {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState(languages.java);
  useEffect(()=>{
    if(props.default) {
      setCode(props.default);
    }
    if(props.defaultLanguage) {
      if(props.defaultLanguage === 'cpp') {
        setLanguage(languages.cpp);
      } else if(props.defaultLanguage === 'java') {
        setLanguage(languages.java);
      }
    }
  })
  const hightlightWithLineNumbers = (input, language) =>
    highlight(input, language)
      .split("\n")
      .map((line, i) => `<span class='editorLineNumber'>${i + 1}</span>${line}`)
      .join("\n");
  function handleChange(e) {
    const value = e.target.value;
    switch(value) {
      case 'java': {
        setLanguage(languages.java);
        props.changeLanguage("java");
        break;
      }
      case 'cpp': {
        setLanguage(languages.cpp);
        props.changeLanguage("cpp");
        break;
      }
      default: break;
    }
  }
  return (
    <>
      <div className="row mt-2">
        <div
          className="w-100 p-0 px-5 d-flex justify-content-end align-items-center py-2 m-0 text-white"
          style={{ backgroundColor: "#120851" }}
        >
          <p className="px-2 ps-4 m-0">Ngôn ngữ</p>
          <select
            onChange={(e) =>  handleChange(e)}
            defaultValue={props.defaultLanguage || "java"}
            style={{ fontSize: "14px" }}
            className="px-2"
          >
            <option value="java">java</option>
            <option value="cpp">c/cpp</option>
          </select>
        </div>
        <div
          className="editor-tool-bar col-12 p-0"
          style={{ backgroundColor: "#f5f6f8" }}
        >
          <Editor
            value={code}
            onValueChange={(code) => {setCode(code); props.changeCode(code)}}
            placeholder={"// Nhập mã nguồn của bạn ở đây !"}
            highlight={(code) => hightlightWithLineNumbers(code, language)}
            padding={10}
            textareaId="codeArea"
            className="editor"
            style={{
              fontFamily: '"Fira code", "Fira Mono", monospace',
              minHeight: 500,
              fontSize: 14,
              width: "100%",
              outline: 0,
            }}
          />
        </div>
      </div>
    </>
  );
}
