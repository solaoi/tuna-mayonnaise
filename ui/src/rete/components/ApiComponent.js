import Rete from "rete";
import ApiControl from "../controls/ApiControl";
import { ApiNode } from "../nodes/ApiNode";

class ApiComponent extends Rete.Component {
  path = ["[ Seed ]"];
  constructor(urlSocket, jsonSocket) {
    super("API");
    this.data.component = ApiNode; // optional
    this.urlSocket = urlSocket;
    this.jsonSocket = jsonSocket;
  }

  builder(node) {
    var urlInput = new Rete.Input("url", "URL", this.urlSocket);
    var jsonInput = new Rete.Input("json", "Dummy Output (JSON)", this.jsonSocket);
    var out = new Rete.Output("json", "JSON", this.jsonSocket);

    return node
      .addInput(urlInput)
      .addInput(jsonInput)
      .addControl(new ApiControl(this.editor, "json", node, true))
      .addOutput(out);
  }

  worker(node, inputs, outputs) {
    var json = inputs["json"].length ? inputs["json"][0] : node.data.json;

    this.editor.nodes
      .find((n) => n.id == node.id)
      .controls.get("json")
      .setValue(json);
    outputs["json"] = json;
  }
}

export default ApiComponent;
