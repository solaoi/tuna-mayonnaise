import Rete from "rete";
import BooleanControl from "../../controls/BooleanControl";
import TextControl from "../../controls/TextControl";
import { MyNode } from "../../nodes/MyNode";

class IfComponent extends Rete.Component {
  path = ["[ Statement ]"];
  constructor(booleanSocket, stringSocket) {
    super("If");
    this.data.component = MyNode; // optional
    this.booleanSocket = booleanSocket;
    this.stringSocket = stringSocket;
  }

  builder(node) {
    const inp1 = new Rete.Input("boolean", "Boolean", this.booleanSocket);
    const inp2 = new Rete.Input("string1", "String", this.stringSocket);
    const inp3 = new Rete.Input("string2", "String", this.stringSocket);
    const out = new Rete.Output("string3", "String", this.stringSocket);


    inp1.addControl(new BooleanControl(this.editor, "boolean", node));
    inp2.addControl(new TextControl(this.editor, "string1", node));
    inp3.addControl(new TextControl(this.editor, "string2", node));

    return node
      .addInput(inp1)
      .addInput(inp2)
      .addInput(inp3)
      .addControl(new TextControl(this.editor, "preview", node, true))
      .addOutput(out);
  }

  worker(node, inputs, outputs) {
    const boolean = inputs["boolean"].length
      ? inputs["boolean"][0]
      : node.data.boolean;
    const string1 = inputs["string1"].length
      ? inputs["string1"][0]
      : node.data.string1;
    const string2 = inputs["string2"].length
      ? inputs["string2"][0]
      : node.data.string2;

    const output = boolean ? string1 : string2;

    this.editor.nodes
      .find((n) => n.id === node.id)
      .controls.get("preview")
      .setValue(output);
    outputs["string3"] = output;
  }
}

export default IfComponent;
