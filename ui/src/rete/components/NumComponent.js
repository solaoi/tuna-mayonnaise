import Rete from "rete";
import NumControl from "../controls/NumControl";

class NumComponent extends Rete.Component {
  path = ["+ Input"];
  constructor(socket) {
    super("Number");
    this.socket = socket;
  }

  builder(node) {
    const out1 = new Rete.Output("num", "Number", this.socket);

    return node
      .addControl(new NumControl(this.editor, "num", node))
      .addOutput(out1);
  }

  worker(node, inputs, outputs) {
    outputs["num"] = node.data.num;
  }
}

export default NumComponent;
