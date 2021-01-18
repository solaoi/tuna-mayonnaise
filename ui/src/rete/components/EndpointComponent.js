import Rete from "rete";
import { EndpointNode } from "../nodes/EndpointNode";
import HTMLControl from "../controls/HTMLControl";
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
    var enabledInput = new Rete.Input(
      "enabledFlag",
      "Enabled",
      this.booleanSocket
    );
    var contentInput = new Rete.Input(
      "content",
      "Content (JSON, HTML)",
      this.stringSocket
    );
    var pathInput = new Rete.Input("path", "Path", this.pathSocket);

    enabledInput.addControl(
      new BooleanControl(this.editor, "enabledFlag", node)
    );
    contentInput.addControl(new TextControl(this.editor, "content", node));
    pathInput.addControl(new TextControl(this.editor, "path", node));

    return node
      .addInput(enabledInput)
      .addInput(contentInput)
      .addInput(pathInput)
      .addControl(new HTMLControl(this.editor, "endpoint", node, true));
  }

  worker(node, inputs, outputs) {
    var content = inputs["content"].length ? inputs["content"][0] : "Rendering...";
    var contentType = ((connection)=>{
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

    this.editor.nodes
      .find((n) => n.id == node.id)
      .controls.get("endpoint")
      .setValue(inputs, "endpoint", content, contentType);
  }
}

export default EndpointComponent;
