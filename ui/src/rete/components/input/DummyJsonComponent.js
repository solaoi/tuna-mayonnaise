import Rete from "rete";
import { JsonControl } from "../../controls/JsonControl";

export class DummyJsonComponent extends Rete.Component {
  path = ["New"];

  constructor(socket) {
    super("DummyJSON");
    this.socket = socket;
  }

  builder(node) {
    const out = new Rete.Output("json", "JSON", this.socket);

    return node
      .addControl(new JsonControl(this.editor, "json", node))
      .addOutput(out);
  }

  worker(node, inputs, outputs) {
    outputs.json = node.data.json;
  }
}
