import React from "react";
import { Node, Socket, Control } from "rete-react-render-plugin";

export class DbNode extends Node {
  render() {
    const { node, bindSocket, bindControl } = this.props;
    const { outputs, controls, inputs, selected } = this.state;

    return (
      <div className={`node ${selected}`} style={{ background: "grey" }}>
        <div className="title">{node.name}</div>
        {/* Outputs */}
        {outputs.map((output) => (
          <div className="output" key={output.key}>
            <div className="output-title">{output.name}</div>
            <Socket
              type="output"
              socket={output.socket}
              io={output}
              innerRef={bindSocket}
            />
          </div>
        ))}
        {/* Controls */}
        {controls.map((control) => (
          <>
            <Control
              className="control"
              key={control.key}
              control={control}
              innerRef={bindControl}
            />
            {control.key === "db" && (
              <div class="control" title="pass">
                <label
                  style={{
                    color: "white",
                    display: "block",
                    textAlign: "left",
                  }}
                >
                  DB_PASS
                </label>
                <textarea
                  rows="3"
                  placeholder={`set ${
                    control.props.value === ""
                      ? "DB"
                      : control.props.value.toUpperCase()
                  }_PASS when tuna api starting`}
                  value=""
                  disabled
                />
              </div>
            )}
          </>
        ))}
        {/* Inputs */}
        {inputs.map((input) => (
          <div className="input" key={input.key}>
            <Socket
              type="input"
              socket={input.socket}
              io={input}
              innerRef={bindSocket}
            />
            {!input.showControl() && (
              <div className="input-title">{input.name}</div>
            )}
            {input.showControl() && (
              <Control
                className="input-control"
                control={input.control}
                innerRef={bindControl}
              />
            )}
          </div>
        ))}
      </div>
    );
  }
}
