import Rete from "rete";
import { UrlControl } from "../../controls/UrlControl";

export class UrlComponent extends Rete.Component {
  path = ["New"];

  constructor(socket) {
    super("URL");
    this.socket = socket;
  }

  builder(node) {
    const out = new Rete.Output("url", "URL", this.socket);

    return node
      .addControl(new UrlControl(this.editor, "url", node))
      .addOutput(out);
  }

  worker(node, _, outputs) {
    outputs.url = node.data.url;
  }
}
