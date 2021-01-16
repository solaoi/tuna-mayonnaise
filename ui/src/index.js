import React from "react";
import ReactDOM from "react-dom";
import { createEditor } from "./rete";

import "./styles.css";

function App() {
  return (
    <div className="App">
      {/* <div className="editor" style={{ display: "flex" }}>
        <div className="dock" style={{ flexBasis: "250px" }}></div>
        <div id="container" className="container" style={{ width: "100%" }} >
          <div
            style={{ width: "100vh", height: "100vh" }}
            ref={(ref) => ref && createEditor(ref)}
          />
        </div>
      </div> */}
      <div
        style={{ width: "100vh", height: "100vh" }}
        ref={(ref) => ref && createEditor(ref)}
      ></div>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
