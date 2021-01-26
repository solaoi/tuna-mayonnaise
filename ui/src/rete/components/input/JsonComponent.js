import Rete from "rete";
import JsonControl from "../../controls/JsonControl";

class JsonComponent extends Rete.Component {
  path = ["[ Input ]"];
  constructor(socket) {
    super("JSON");
    this.socket = socket;
  }

  builder(node) {
    var out = new Rete.Output("json", "JSON", this.socket);

    return node
      .addControl(new JsonControl(this.editor, "json", node))
      .addOutput(out);
  }

  worker(node, inputs, outputs) {
    outputs["json"] = node.data.json;
  }
}

export default JsonComponent;
