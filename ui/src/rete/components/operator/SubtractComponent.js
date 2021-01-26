import Rete from "rete";
import NumControl from "../../controls/NumControl";
import { MyNode } from "../../nodes/MyNode";

class SubtractComponent extends Rete.Component {
  path = ["[ Operator ]"];
  constructor(socket) {
    super("Subtract");
    this.data.component = MyNode; // optional
    this.socket = socket;
  }

  builder(node) {
    const inp1 = new Rete.Input("num1", "Number", this.socket);
    const inp2 = new Rete.Input("num2", "Number2", this.socket);
    const out = new Rete.Output("num", "Number", this.socket);

    inp1.addControl(new NumControl(this.editor, "num1", node));
    inp2.addControl(new NumControl(this.editor, "num2", node));

    return node
      .addInput(inp1)
      .addInput(inp2)
      .addControl(new NumControl(this.editor, "preview", node, true))
      .addOutput(out);
  }

  worker(node, inputs, outputs) {
    const n1 = inputs["num1"].length ? inputs["num1"][0] : node.data.num1;
    const n2 = inputs["num2"].length ? inputs["num2"][0] : node.data.num2;
    const diff = n1 - n2;

    this.editor.nodes
      .find((n) => n.id == node.id)
      .controls.get("preview")
      .setValue(diff);
    outputs["num"] = diff;
  }
}

export default SubtractComponent;
