import Rete from "rete";
import TextControl from "../controls/TextControl";
import BooleanControl from "../controls/BooleanControl";
import NumControl from "../controls/NumControl";
import { ApiNode } from "../nodes/ApiNode";

class ApiComponent extends Rete.Component {
  path = ["New"];
  constructor(jsonSocket) {
    super("API");
    this.data.component = ApiNode; // optional
    this.jsonSocket = jsonSocket;
  }

  builder(node) {
    const jsonInput = new Rete.Input(
      "json",
      "Dummy Output (JSON)",
      this.jsonSocket
    );
    const out = new Rete.Output("json", "JSON", this.jsonSocket);

    return node
      .addInput(jsonInput)
      .addControl(
        new TextControl(
          this.editor,
          "url",
          node,
          false,
          "URL",
          "https://example.com/bar"
        )
      )
      .addControl(
        new BooleanControl(
          this.editor,
          "cached",
          node,
          false,
          "Cached (In-Memory)"
        )
      )
      .addControl(
        new NumControl(
          this.editor,
          "cacheTime",
          node,
          false,
          "CacheTime (seconds)",
          30
        )
      )
      .addOutput(out);
  }

  worker(node, inputs, outputs) {
    outputs["json"] = inputs["json"].length
      ? inputs["json"][0]
      : node.data.json;
    outputs["url"] = node.data.url;
    outputs["cached"] = node.data.cached;

    this.editor.nodes
      .find((n) => n.id === node.id)
      .controls.get("cacheTime")
      .setValue(node.data.cacheTime, !node.data.cached);
  }
}

export default ApiComponent;
