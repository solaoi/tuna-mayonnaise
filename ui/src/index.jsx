import React from "react";
import ReactDOM from "react-dom";
import Modal from "react-modal";
import { ToastContainer } from "react-toastify";
import { createEditor } from "./rete";
import "react-toastify/dist/ReactToastify.css";
import "./styles.css";

function App() {
  return (
    <div className="App">
      <ToastContainer />
      <img
        className="rightClick"
        src="right-click.svg"
        width="200"
        height="200"
        alt="RightClick for Menu"
        style={{
          display: "none",
          position: "absolute",
          top: "25%",
          left: "25%",
          pointerEvents: "none",
        }}
      />
      <div
        style={{ width: "100vh", height: "100vh" }}
        ref={(ref) => ref && createEditor(ref)}
      />
    </div>
  );
}

Modal.setAppElement("#root");
const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
