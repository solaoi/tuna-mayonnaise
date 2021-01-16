import Rete from "rete";
import HandlebarsControl from "../../controls/template/HandlebarsControl";

class HandlebarsComponent extends Rete.Component {
  path = ["+ Template"];
  constructor(socket) {
    super("Handlebars");
    this.socket = socket;
  }

  builder(node) {
    var out = new Rete.Output("hbs", "Handlebars", this.socket);
    var ctrl = new HandlebarsControl(this.editor, "hbs", node);

    return node.addControl(ctrl).addOutput(out);
  }

  worker(node, inputs, outputs) {
    outputs["hbs"] = node.data.hbs;
  }
}

export default HandlebarsComponent;
