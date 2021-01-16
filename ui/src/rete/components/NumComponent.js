import Rete from "rete";
import NumControl from "../controls/NumControl";

class NumComponent extends Rete.Component {
  path = ["+ Input"];
  constructor(socket) {
    super("Number");
    this.socket = socket;
  }

  builder(node) {
    var out1 = new Rete.Output("num", "Number", this.socket);
    var ctrl = new NumControl(this.editor, "num", node);

    return node.addControl(ctrl).addOutput(out1);
  }

  worker(node, inputs, outputs) {
    outputs["num"] = node.data.num;
  }
}

export default NumComponent;
