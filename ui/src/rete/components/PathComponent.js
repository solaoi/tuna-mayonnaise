import Rete from "rete";
import TextControl from "../controls/TextControl";

class PathComponent extends Rete.Component {
  path = ["+ Input"];
  constructor(socket) {
    super("Path");
    this.socket = socket;
  }

  builder(node) {
    var out1 = new Rete.Output("path", "Path", this.socket);
    var ctrl = new TextControl(this.editor, "path", node);

    return node.addControl(ctrl).addOutput(out1);
  }

  worker(node, inputs, outputs) {
    outputs["path"] = node.data.path;
  }
}

export default PathComponent;
