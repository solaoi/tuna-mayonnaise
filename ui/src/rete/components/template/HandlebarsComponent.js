import Rete from "rete";
import { HandlebarsControl } from "../../controls/template/HandlebarsControl";

export class HandlebarsComponent extends Rete.Component {
  path = ["New"];

  constructor(socket) {
    super("Handlebars");
    this.socket = socket;
  }

  builder(node) {
    const out = new Rete.Output("hbs", "Handlebars", this.socket);

    return node
      .addControl(new HandlebarsControl(this.editor, "hbs", node))
      .addOutput(out);
  }

  worker(node, _, outputs) {
    outputs.hbs = node.data.hbs;
  }
}
