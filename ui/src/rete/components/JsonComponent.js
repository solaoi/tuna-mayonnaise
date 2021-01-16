import Rete from "rete";
import JsonControl from "../controls/JsonControl";

class JsonComponent extends Rete.Component {
  path = ["+ Input"];
  constructor(socket) {
    super("Json");
    this.socket = socket;
  }

  builder(node) {
    var out = new Rete.Output("json", "Json", this.socket);
    var ctrl = new JsonControl(this.editor, "json", node);

    return node.addControl(ctrl).addOutput(out);
  }

  worker(node, inputs, outputs) {
    outputs["json"] = node.data.json;
  }
}

export default JsonComponent;
