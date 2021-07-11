import React from "react";
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-json";
import "prismjs/themes/prism.css";

const EditableJsonComponent = ({ value, onChange }) => {
  const [code, setCode] = React.useState(value);
  return (
    <Editor
      value={code}
      onValueChange={(code) => {
        setCode(code);
        onChange(code);
      }}
      highlight={(code) => highlight(code, languages.json)}
      padding={10}
      style={{
        fontFamily: '"Fira code", "Fira Mono", monospace',
        fontSize: 12,
        background: "#FFF",
        maxWidth: "300px"
      }}
    />
  );
};

export default EditableJsonComponent;
