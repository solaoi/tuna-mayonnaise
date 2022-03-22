import Rete from "rete";
import { RawHTMLControl } from "../../controls/RawHTMLControl";

export class HtmlComponent extends Rete.Component {
  path = ["New"];

  constructor(socket) {
    super("HTML");
    this.socket = socket;
  }

  builder(node) {
    const out = new Rete.Output("html", "HTML", this.socket);

    return node
      .addControl(new RawHTMLControl(this.editor, "html", node))
      .addOutput(out);
  }

  worker(node, _, outputs) {
    outputs.html = node.data.html;
  }
}
