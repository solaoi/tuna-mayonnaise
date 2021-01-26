import Rete from "rete";
import { EndpointNode } from "../nodes/EndpointNode";
import EndpointControl from "../controls/EndpointControl";
import BooleanControl from "../controls/BooleanControl";
import TextControl from "../controls/TextControl";

class EndpointComponent extends Rete.Component {
  constructor(booleanSocket, stringSocket, pathSocket) {
    super("Endpoint");
    this.data.component = EndpointNode; // optional
    this.booleanSocket = booleanSocket;
    this.stringSocket = stringSocket;
    this.pathSocket = pathSocket;
  }

  builder(node) {
    const enabledInput = new Rete.Input(
      "enabledFlag",
      "Enabled (Boolean)",
      this.booleanSocket
    );
    const contentInput = new Rete.Input(
      "content",
      "Content (JSON/HTML)",
      this.stringSocket
    );
    const pathInput = new Rete.Input("path", "Path", this.pathSocket);

    enabledInput.addControl(
      new BooleanControl(this.editor, "enabledFlag", node)
    );
    contentInput.addControl(new TextControl(this.editor, "content", node));
    pathInput.addControl(new TextControl(this.editor, "path", node));

    return node
      .addInput(enabledInput)
      .addInput(contentInput)
      .addInput(pathInput)
      .addControl(new EndpointControl(this.editor, "endpoint", node, true));
  }

  worker(node, inputs, outputs) {
    const content = inputs["content"].length ? inputs["content"][0] : "Rendering...";
    const contentType = ((connection)=>{
      if(connection){
        if (connection.output === "html"){
          return "text/html; charset=utf-8";
        } else if(connection.output === "json"){
          return "application/json; charset=utf-8";
        }else{
          return "text/plain; charset=utf-8"
        }
      }
    })(node.inputs.content.connections[0]);
    const enabledFlag = inputs["enabledFlag"].length ? inputs["enabledFlag"][0] : false;

    this.editor.nodes
      .find((n) => n.id == node.id)
      .controls.get("endpoint")
      .setValue(inputs, content, contentType, enabledFlag);
  }
}

export default EndpointComponent;
