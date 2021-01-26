import Rete from "rete";
import PugControl from "../../controls/template/PugControl";

class PugComponent extends Rete.Component {
  path = ["[ Template ]"];
  constructor(socket) {
    super("Pug");
    this.socket = socket;
  }

  builder(node) {
    const out = new Rete.Output("pug", "Pug", this.socket);

    return node
      .addControl(new PugControl(this.editor, "pug", node))
      .addOutput(out);
  }

  worker(node, inputs, outputs) {
    outputs["pug"] = node.data.pug;
  }
}

export default PugComponent;
