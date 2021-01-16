import Rete from "rete";
import EJSControl from "../../controls/template/EJSControl";

class EJSComponent extends Rete.Component {
  path = ["+ Template"];
  constructor(socket) {
    super("EJS");
    this.socket = socket;
  }

  builder(node) {
    var out = new Rete.Output("ejs", "EJS", this.socket);
    var ctrl = new EJSControl(this.editor, "ejs", node);

    return node.addControl(ctrl).addOutput(out);
  }

  worker(node, inputs, outputs) {
    outputs["ejs"] = node.data.ejs;
  }
}

export default EJSComponent;
