import React, { useState } from "react";
/* eslint import/no-unresolved: 0 */
import pug from "pug";
import Editor from "@monaco-editor/react";
import useInterval from "use-interval";

export const EditablePugComponent = ({ value, onChange }) => {
  const [code, setCode] = useState(value);
  const [warn, setWarn] = useState(false);
  const [stack, setStack] = useState("");
  useInterval(() => {
    if (stack !== "") {
      import("react-hot-toast").then((_) => _.toast.error(stack));
      setStack("");
    }
  }, 8000);

  return (
    <Editor
      className={warn ? "warningCode" : ""}
      height="500px"
      width="750px"
      language="pug"
      value={code}
      onChange={(c) => {
        try {
          if (c) pug.compile(c);
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
