import Rete from "rete";
import { EndpointNode } from "../nodes/EndpointNode";
import HTMLControl from "../controls/HTMLControl";
import BooleanControl from "../controls/BooleanControl";
import TextControl from "../controls/TextControl";

class EndpointComponent extends Rete.Component {
  constructor(booleanSocket, stringSocket) {
    super("Endpoint");
    this.data.component = EndpointNode; // optional
    this.booleanSocket = booleanSocket;
    this.stringSocket = stringSocket;
  }

  builder(node) {
    var inp1 = new Rete.Input("boolean", "Enabled", this.booleanSocket);
    var inp2 = new Rete.Input("string", "String", this.stringSocket);

    inp1.addControl(new BooleanControl(this.editor, "boolean", node));
    inp2.addControl(new TextControl(this.editor, "string", node));

    return node
      .addInput(inp1)
      .addInput(inp2)
      .addControl(new HTMLControl(this.editor, "preview", node, true));
  }

  worker(node, inputs, outputs) {}
}

export default EndpointComponent;
