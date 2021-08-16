import React from "react";
import ReactDOM from "react-dom";
import Modal from "react-modal";
import { createEditor } from "./rete";
import { ToastContainer } from "react-toastify";
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
      ></img>
      <div
        style={{ width: "100vh", height: "100vh" }}
        ref={(ref) => ref && createEditor(ref)}
      ></div>
    </div>
  );
}

Modal.setAppElement("#root");
const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
