import React from "react";
import { Node, Socket, Control } from "rete-react-render-plugin";

export class JsonManagerNode extends Node {
  render() {
    const { bindSocket, bindControl } = this.props;
    const { outputs, controls, inputs, selected } = this.state;

    return (
      <div className={`node ${selected}`} style={{ background: "grey" }}>
        <div className="title">JSONManager</div>
        {/* Outputs */}
        {outputs.map(output => (
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
        {controls.map(control => (
          <Control
            className="control"
            key={control.key}
            control={control}
            innerRef={bindControl}
          />
        ))}
        {/* Inputs */}
        {inputs.map(input => (
          <div className="input jsonManagerInput" key={input.key}>
            <Socket
              type="input"
              socket={input.socket}
              io={input}
              innerRef={bindSocket}
            />
            <div className="input-title">{input.name}</div>
          </div>
        ))}
      </div>
    );
  }
}
