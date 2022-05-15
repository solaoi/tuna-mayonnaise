import React, { useState } from "react";
import Editor from "@monaco-editor/react";

export const EditableJsonComponent = ({ value, onChange }) => {
  const [code, setCode] = useState(value);
  const options = {
    minimap: { enabled: false },
  };

  return (
    <Editor
      height="300px"
      width="500px"
      language="json"
      value={code}
      options={options}
      onChange={(c) => {
        setCode(c);
        onChange(c);
      }}
    />
  );
};
