import Rete from "rete";
import { TextAreaControl } from "../controls/TextAreaControl";
import { BooleanControl } from "../controls/BooleanControl";
import { NumControl } from "../controls/NumControl";
import { DefaultNode } from "../nodes/DefaultNode";
import { SelectControl } from "../controls/SelectControl";

export class ApiComponent extends Rete.Component {
  path = ["New"];

  constructor(jsonSocket, dummyJsonSocket, urlSocket) {
    super("API");
    this.data.component = DefaultNode; // optional
    this.jsonSocket = jsonSocket;
    this.dummyJsonSocket = dummyJsonSocket;
    this.urlSocket = urlSocket;
  }

  builder(node) {
    const queryInput = new Rete.Input("query", "Query (JSON)", this.jsonSocket);
    const dummyJsonInput = new Rete.Input(
      "json",
      "Expected (DummyJSON)",
      this.dummyJsonSocket
    );
    const urlInput = new Rete.Input("url", "URL", this.urlSocket);
    const out = new Rete.Output("json", "JSON", this.jsonSocket);

    return node
      .addInput(urlInput)
      .addInput(queryInput)
      .addInput(dummyJsonInput)
      .addControl(
        new SelectControl(this.editor, "method", node, false, "Method", [
          "GET",
          "POST",
          "PUT",
          "PATCH",
          "DELETE",
          "OPTIONS",
        ])
      )
      .addControl(
        new TextAreaControl(
          this.editor,
          "headers",
          node,
          false,
          "Headers",
          '{"KEY":"VALUE"}'
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
    outputs.query = inputs.query.length ? inputs.query[0] : node.data.query;
    outputs.json = inputs.json.length ? inputs.json[0] : node.data.json;
    outputs.url = inputs.url.length ? inputs.url[0] : node.data.url;
    outputs.headers = node.data.headers;
    outputs.cached = node.data.cached;

    this.editor.nodes
      .find((n) => n.id === node.id)
      .controls.get("cacheTime")
      .setValue(node.data.cacheTime, !node.data.cached, !node.data.cached);

    const conns = this.editor.nodes
      .find((n) => n.id === node.id)
      .getConnections();
    if (conns.length > 0) {
      conns.forEach((c) => this.editor.view.connections.get(c).update());
    }
  }
}
