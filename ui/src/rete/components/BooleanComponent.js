import Rete from "rete";
import BooleanControl from "../controls/BooleanControl";

class BooleanComponent extends Rete.Component {
  path = ["+ Input"];
  constructor(socket) {
    super("Boolean");
    this.socket = socket;
  }

  builder(node) {
    var out1 = new Rete.Output("boolean", "Boolean", this.socket);
    var ctrl = new BooleanControl(this.editor, "boolean", node);

    return node.addControl(ctrl).addOutput(out1);
  }

  worker(node, inputs, outputs) {
    outputs["boolean"] = node.data.boolean;
  }
}

export default BooleanComponent;
