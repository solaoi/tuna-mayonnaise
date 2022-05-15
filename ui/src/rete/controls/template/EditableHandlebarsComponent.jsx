import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import useInterval from "use-interval";

export const EditableHandlebarsComponent = ({ value, onChange }) => {
  const [code, setCode] = useState(value);
  const [warn, setWarn] = useState(false);
  const [stack, setStack] = useState(null);
  useInterval(() => {
    if (stack !== null) {
      import("react-hot-toast").then((_) => _.toast.error(stack));
      setStack(null);
    }
  }, 8000);

  return (
    <Editor
      className={warn ? "warningCode" : ""}
      height="500px"
      width="750px"
      language="handlebars"
      value={code}
      onChange={(c) => {
        import("handlebars")
          .then((h) => {
            h.precompile(c);
            setWarn(false);
            setStack(null);
          })
          .catch((e) => {
            setStack(e.message);
            setWarn(true);
          });
        setCode(c);
        onChange(c);
      }}
    />
  );
};
