import React from "react";
import ReactDOM from "react-dom";
import { createEditor } from "./rete";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./styles.css";

function App() {
  return (
    <div className="App">
      <ToastContainer />
      <div
        style={{ width: "100vh", height: "100vh" }}
        ref={(ref) => ref && createEditor(ref)}
      ></div>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
