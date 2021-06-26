import Rete from "rete";
import { EndpointNode } from "../nodes/EndpointNode";
import EndpointControl from "../controls/EndpointControl";
import BooleanControl from "../controls/BooleanControl";
import TextControl from "../controls/TextControl";

class EndpointComponent extends Rete.Component {
  path = ["[ Endpoint ]"];
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
      .addControl(new BooleanControl(this.editor, "enabledFlag", node, false, "Enabled"))
      .addControl(new TextControl(this.editor, "path", node, false, "Path", "/foo"));
  }

  worker(node, inputs, outputs) {
    const content = inputs["content"].length ? inputs["content"][0] : "Rendering...";
    const contentType = ((connection)=>{
      if(connection){
        if (connection.output === "html"){
          return "text/html; charset=utf-8";
        } else if(connection.output === "json"){
          return "application/json; charset=utf-8";
        } else {
          return "text/plain; charset=utf-8"
        }
      }
    })(node.inputs.content.connections[0]);
    const enabledFlag = node.data.enabledFlag;
    const path = node.data.path;

    this.editor.nodes
      .find((n) => n.id === node.id)
      .controls.get("endpoint")
      .setValue(inputs, content, contentType, enabledFlag, path);
  }
}

export default EndpointComponent;
