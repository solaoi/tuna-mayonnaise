import Rete from "rete";
import { JsonManagerNode } from "../nodes/JsonManagerNode";
import JsonManagerControl from "../controls/JsonManagerControl";

class JsonManagerComponent extends Rete.Component {
  path = ["New"];
  constructor(jsonSocket) {
    super("JSONManager");
    this.data.component = JsonManagerNode; // optional
    this.jsonSocket = jsonSocket;
  }

  builder(node) {
    const contentInput = new Rete.Input(
      "content",
      "JSONs",
      this.jsonSocket,
      true
    );
    const out = new Rete.Output("json", "JSON", this.jsonSocket);

    return node
      .addInput(contentInput)
      .addControl(new JsonManagerControl(this.editor, "jsonManager", node, true))
      .addOutput(out);
  }

  worker(node, inputs, outputs) {
    this.editor.nodes
      .find((n) => n.id === node.id)
      .controls.get("jsonManager")
      .setValue(inputs);

    if(node.data.output === "[]"){
      outputs["json"] = "";
    } else if(node.data.output !== ""){
      const previewParam = JSON.parse(node.data.output).map(v => [v.key, JSON.parse(v.value)]);
      outputs["json"] = JSON.stringify(Object.fromEntries(previewParam));
    }

    outputs["outputFunctions"] = node.data.outputFunctions;
  }
}

export default JsonManagerComponent;
