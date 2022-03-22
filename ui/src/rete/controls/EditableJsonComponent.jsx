import React, { useState } from "react";
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-json";
import "prismjs/themes/prism.css";
import * as jsonlint from "jsonlint-mod";
import useInterval from "use-interval";

export const EditableJsonComponent = ({ value, onChange }) => {
  const [code, setCode] = useState(value);
  const [warn, setWarn] = useState(false);
  const [stack, setStack] = useState(null);
  useInterval(() => {
    if (stack !== null) {
      import("react-toastify").then(({ toast }) => toast.error(stack));
      setStack(null);
    }
  }, 10000);

  return (
    <Editor
      value={code}
      onValueChange={(c) => {
        try {
          jsonlint.parse(c);
          setWarn(false);
          setStack(null);
        } catch (e) {
          setStack(e.message);
          setWarn(true);
        }
        setCode(c);
        onChange(c);
      }}
      highlight={(c) => highlight(c, languages.json)}
      padding={10}
      style={{
        fontFamily: '"Fira code", "Fira Mono", monospace',
        fontSize: 12,
        background: warn ? "rgba(255, 0, 80, 0.7)" : "#FFF",
        maxWidth: "300px",
      }}
    />
  );
};
