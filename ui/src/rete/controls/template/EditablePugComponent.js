import React from "react";
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-markup";
import "prismjs/components/prism-markup-templating";
import "prismjs/components/prism-pug";
import "prismjs/themes/prism.css";

const EditablePugComponent = ({ value, onChange }) => {
  const [code, setCode] = React.useState(value);
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
          background: "#FFF",
          maxWidth: "800px",
        }}
      />
    </div>
  );
};

export default EditablePugComponent;
