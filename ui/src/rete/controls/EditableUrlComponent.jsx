import React, { useState } from "react";
import Editor from "@monaco-editor/react";

import useInterval from "use-interval";

export const EditableUrlComponent = ({ value, onChange }) => {
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
    scrollbar: {
      vertical: "hidden",
      horizontal: "hidden",
      useShadows: false,
    },
  };
  return (
    <Editor
      className={warn ? "warningCode" : ""}
      height="1.2em"
      width="500px"
      language="uri"
      value={code}
      options={options}
      onChange={(c) => {
        if (c && (c.startsWith("https://") || c.startsWith("http://"))) {
          setWarn(false);
          setStack("");
        } else {
          setStack("URL doesn't start with https:// or http://");
          setWarn(true);
        }
        setCode(c);
        onChange(c);
      }}
    />
  );
};
