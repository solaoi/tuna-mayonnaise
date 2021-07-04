import Rete from "rete";
import TextControl from "../controls/TextControl";
import { ApiNode } from "../nodes/ApiNode";

class ApiComponent extends Rete.Component {
  path = ["New"];
  constructor(jsonSocket) {
    super("API");
    this.data.component = ApiNode; // optional
    this.jsonSocket = jsonSocket;
  }

  builder(node) {
    const jsonInput = new Rete.Input("json", "Dummy Output (JSON)", this.jsonSocket);
    const out = new Rete.Output("json", "JSON", this.jsonSocket);

    return node
      .addInput(jsonInput)
      .addControl(new TextControl(this.editor, "url", node, false, "URL", "https://example.com/bar"))
      .addOutput(out);
  }

  worker(node, inputs, outputs) {
    outputs["json"] = inputs["json"].length ? inputs["json"][0] : node.data.json;
    outputs["url"] = node.data.url;
  }
}

export default ApiComponent;
