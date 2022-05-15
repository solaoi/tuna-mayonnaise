import "regenerator-runtime/runtime";
import Modal from "react-modal";
import { Toaster } from "react-hot-toast";
import "./styles.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createEditor } from "./rete";

const App = () => (
  <div className="App">
    <Toaster position="top-right" />
    <img
      className="rightClick"
      src="./right-click.svg"
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

Modal.setAppElement("#root");
const rootElement = document.getElementById("root");
if (rootElement === null) throw Error;
const root = createRoot(rootElement);
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
