import React, { useState } from "react";
import Editor from "@monaco-editor/react";

export const EditableHtmlComponent = ({ value, onChange }) => {
  const [code, setCode] = useState(value);

  return (
    <Editor
      height="500px"
      width="750px"
      language="html"
      value={code}
      onChange={(c) => {
        setCode(c);
        onChange(c);
      }}
    />
  );
};
