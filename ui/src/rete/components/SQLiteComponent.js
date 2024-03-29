import Rete from "rete";
import { TextControl } from "../controls/TextControl";
import { BooleanControl } from "../controls/BooleanControl";
import { NumControl } from "../controls/NumControl";
import { SQLiteNode } from "../nodes/SQLiteNode";

export class SQLiteComponent extends Rete.Component {
  path = ["New"];

  constructor(jsonSocket, dummyJsonSocket, sqlSocket) {
    super("SQLite");
    this.data.component = SQLiteNode; // optional
    this.dummyJsonSocket = dummyJsonSocket;
    this.jsonSocket = jsonSocket;
    this.sqlSocket = sqlSocket;
  }

  builder(node) {
    const dummyJsonInput = new Rete.Input(
      "json",
      "Expected (DummyJSON)",
      this.dummyJsonSocket
    );
    const out = new Rete.Output("json", "JSON", this.jsonSocket);
    const sqlInput = new Rete.Input("sql", "SQL", this.sqlSocket);

    return node
      .addInput(sqlInput)
      .addInput(dummyJsonInput)
      .addControl(
        new TextControl(
          this.editor,
          "filename",
          node,
          false,
          "FILE_NAME",
          "test.db"
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
    outputs.json = inputs.json.length ? inputs.json[0] : node.data.json;
    outputs.sql = inputs.sql.length ? inputs.sql[0] : node.data.sql;
    outputs.filename = node.data.filename;
    outputs.cached = node.data.cached;
    outputs.cacheTime = node.data.cacheTime;

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
