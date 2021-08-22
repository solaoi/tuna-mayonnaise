import Rete from "rete";
import { EndpointNode } from "../nodes/EndpointNode";
import { EndpointControl } from "../controls/EndpointControl";
import { BooleanControl } from "../controls/BooleanControl";
import { TextControl } from "../controls/TextControl";
import { PathControl } from "../controls/PathControl";

export class EndpointComponent extends Rete.Component {
  path = ["New"];

  constructor(stringSocket) {
    super("Endpoint");
    this.data.component = EndpointNode; // optional
    this.stringSocket = stringSocket;
  }

  builder(node) {
    node.data.enabledFlag = node.data.enabledFlag ?? true;
    const contentInput = new Rete.Input(
      "content",
      "Content (JSON/HTML)",
      this.stringSocket
    );
    contentInput.addControl(new TextControl(this.editor, "content", node));

    return node
      .addInput(contentInput)
      .addControl(new EndpointControl(this.editor, "endpoint", node, true))
      .addControl(
        new BooleanControl(this.editor, "enabledFlag", node, false, "Enabled")
      )
      .addControl(
        new PathControl(this.editor, "path", node, false, "Path", "/foo")
      );
  }

  worker(node, inputs) {
    const content = inputs.content.length ? inputs.content[0] : "Rendering...";
    const contentType = ((connection) => {
      if (connection) {
        if (connection.output === "html") {
          return "text/html; charset=utf-8";
        }
        if (connection.output === "json") {
          return "application/json; charset=utf-8";
        }
      }
      return "text/plain; charset=utf-8";
    })(node.inputs.content.connections[0]);
    const { enabledFlag } = node.data;
    const { path } = node.data;

    this.editor.nodes
      .find((n) => n.id === node.id)
      .controls.get("endpoint")
      .setValue(inputs, content, contentType, enabledFlag, path);
  }
}
