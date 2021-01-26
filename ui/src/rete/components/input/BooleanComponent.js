import Rete from "rete";
import BooleanControl from "../../controls/BooleanControl";

class BooleanComponent extends Rete.Component {
  path = ["[ Input ]"];
  constructor(socket) {
    super("Boolean");
    this.socket = socket;
  }

  builder(node) {
    var out1 = new Rete.Output("boolean", "Boolean", this.socket);

    return node
      .addControl(new BooleanControl(this.editor, "boolean", node))
      .addOutput(out1);
  }

  worker(node, inputs, outputs) {
    outputs["boolean"] = node.data.boolean;
  }
}

export default BooleanComponent;
