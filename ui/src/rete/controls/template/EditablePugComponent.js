import React, { useState } from "react";
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-markup";
import "prismjs/components/prism-markup-templating";
import "prismjs/components/prism-pug";
import "prismjs/themes/prism.css";
import * as pug from "pug";
import { toast } from "react-toastify";
import { useInterval } from "react-use";

const EditablePugComponent = ({ value, onChange }) => {
  const [code, setCode] = useState(value);
  const [warn, setWarn] = useState(false);
  const [stack, setStack] = useState(null);
  useInterval(() => {
    if (stack !== null) {
      toast.warn(stack);
      setStack(null);
    }
  }, 10000);

  return (
    <div
      className="hasScrollbar"
      style={{ overflowY: "auto", maxHeight: "500px" }}
    >
      <Editor
        textareaClassName="editorTextarea"
        preClassName="line-numbers"
        value={code}
        onValueChange={(code) => {
          try {
            pug.compile(code);
            setWarn(false);
            setStack(null);
          } catch (e) {
            setStack(e.message);
            setWarn(true);
          }
          setCode(code);
          onChange(code);
        }}
        highlight={(code) =>
          highlight(code, languages.pug)
            .split("\n")
            .map(
              (line) =>
                `<span class="container_editor_line_number">${line}</span>`
            )
            .join("\n")
        }
        padding={10}
        style={{
          fontFamily: '"Fira code", "Fira Mono", monospace',
          fontSize: 12,
          background: warn ? "rgba(255, 0, 80, 0.7)" : "#FFF",
          maxWidth: "800px",
        }}
      />
    </div>
  );
};

export default EditablePugComponent;