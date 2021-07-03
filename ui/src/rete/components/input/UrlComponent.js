import Rete from "rete";
import TextControl from "../../controls/TextControl";

class UrlComponent extends Rete.Component {
  constructor(socket) {
    super("URL");
    this.socket = socket;
  }

  builder(node) {
    const out1 = new Rete.Output("url", "URL", this.socket);

    return node
      .addControl(new TextControl(this.editor, "url", node))
      .addOutput(out1);
  }

  worker(node, inputs, outputs) {
    outputs["url"] = node.data.url;
  }
}

export default UrlComponent;
