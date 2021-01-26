import Rete from "rete";
import TextControl from "../../controls/TextControl";

class PathComponent extends Rete.Component {
  path = ["[ Input ]"];
  constructor(socket) {
    super("Path");
    this.socket = socket;
  }

  builder(node) {
    const out1 = new Rete.Output("path", "Path", this.socket);

    return node
      .addControl(new TextControl(this.editor, "path", node))
      .addOutput(out1);
  }

  worker(node, inputs, outputs) {
    outputs["path"] = node.data.path;
  }
}

export default PathComponent;
