import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import * as parser from "js-sql-parser";
import useInterval from "use-interval";

export const EditableSqlComponent = ({ value, onChange }) => {
  const [code, setCode] = useState(value);
  const [warn, setWarn] = useState(false);
  const [stack, setStack] = useState("");
  useInterval(() => {
    if (stack !== "") {
      import("react-hot-toast").then((_) => _.toast.error(stack));
      setStack("");
    }
  }, 8000);
  const options = {
    minimap: { enabled: false },
  };

  return (
    <Editor
      className={warn ? "warningCode" : ""}
      height="300px"
      width="500px"
      language="sql"
      value={code}
      options={options}
      onChange={(c) => {
        try {
          const replacedForPlaceHolder = c
            ? c.replaceAll(/\$\{.*?\}/g, "dummy")
            : c;
          parser.parse(replacedForPlaceHolder);
          setWarn(false);
          setStack("");
        } catch (e) {
          setStack(e.message);
          setWarn(true);
        }
        setCode(c);
        onChange(c);
      }}
    />
  );
};
