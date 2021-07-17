import React, { useState } from "react";
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-sql";
import "prismjs/themes/prism.css";
import * as parser from "js-sql-parser";
import { toast } from "react-toastify";
import { useInterval } from "react-use";

const EditableSqlComponent = ({ value, onChange }) => {
  const [code, setCode] = React.useState(value);
  const [warn, setWarn] = useState(false);
  const [stack, setStack] = useState(null);
  useInterval(() => {
    if (stack !== null) {
      toast.warn(stack);
      setStack(null);
    }
  }, 10000);

  return (
    <Editor
      value={code}
      onValueChange={(code) => {
        try {
          parser.parse(code);
          setWarn(false);
          setStack(null);
        } catch (e) {
          setStack(e.message);
          setWarn(true);
        }
        setCode(code);
        onChange(code);
      }}
      highlight={(code) => highlight(code, languages.sql)}
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

export default EditableSqlComponent;
