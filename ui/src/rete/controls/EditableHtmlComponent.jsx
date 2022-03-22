import React, { useState } from "react";
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-markup";
import "prismjs/themes/prism.css";

export const EditableHtmlComponent = ({ value, onChange }) => {
  const [code, setCode] = useState(value);

  return (
    <div
      className="hasScrollbar"
      style={{ overflowY: "auto", maxHeight: "500px" }}
    >
      <Editor
        textareaClassName="editorTextarea"
        preClassName="line-numbers"
        value={code}
        onValueChange={(c) => {
          setCode(c);
          onChange(c);
        }}
        highlight={(c) =>
          highlight(c, languages.xml)
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
          background: "#FFF",
          maxWidth: "800px",
        }}
      />
    </div>
  );
};
