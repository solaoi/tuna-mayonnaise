import Rete from "rete";
import TextControl from "../../controls/TextControl";

class TextComponent extends Rete.Component {
  path = ["[ Input ]"];
  constructor(socket) {
    super("Text");
    this.socket = socket;
  }

  builder(node) {
    var out1 = new Rete.Output("text", "Text", this.socket);

    return node
      .addControl(new TextControl(this.editor, "text", node))
      .addOutput(out1);
  }

  worker(node, inputs, outputs) {
    outputs["text"] = node.data.text;
  }
}

export default TextComponent;
