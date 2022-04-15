import Rete from "rete";
import { DefaultNode } from "../nodes/DefaultNode";
import { SelectControl } from "../controls/SelectControl";

export class RequestComponent extends Rete.Component {
  path = ["New"];

  constructor(jsonSocket, dummyJsonSocket) {
    super("Request");
    this.data.component = DefaultNode; // optional
    this.jsonSocket = jsonSocket;
    this.dummyJsonSocket = dummyJsonSocket;
  }

  builder(node) {
    const dummyJsonInput = new Rete.Input(
      "json",
      "Output (DummyJSON)",
      this.dummyJsonSocket
    );
    const out = new Rete.Output("json", "JSON", this.jsonSocket);

    return node
      .addInput(dummyJsonInput)
      .addControl(
        new SelectControl(this.editor, "type", node, false, "Type", [
          "QUERY",
          "COOKIE",
          "BODY",
        ])
      )
      .addOutput(out);
  }

  worker(node, inputs, outputs) {
    outputs.json = inputs.json.length ? inputs.json[0] : node.data.json;
    outputs.type = node.data.type;
  }
}
