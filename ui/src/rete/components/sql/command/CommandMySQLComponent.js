import Rete from "rete";
import { TextControl } from "../../../controls/TextControl";
import { SelectControl } from "../../../controls/SelectControl";
import { BooleanControl } from "../../../controls/BooleanControl";
import { NumControl } from "../../../controls/NumControl";
import { DbNode } from "../../../nodes/DbNode";

export class CommandMySQLComponent extends Rete.Component {
  path = ["New/SQL"];

  constructor(jsonSocket, sqlSocket) {
    super("CommandMySQL");
    this.data.component = DbNode; // optional
    this.jsonSocket = jsonSocket;
    this.sqlSocket = sqlSocket;
  }

  builder(node) {
    const out = new Rete.Output("json", "JSON", this.jsonSocket);
    const sqlInput = new Rete.Input("sql", "SQL", this.sqlSocket);

    return node
      .addInput(sqlInput)
      .addControl(
        new SelectControl(this.editor, "tls", node, false, "TLS", [
          "false",
          "true",
          "skip-verify",
          "preferred",
        ])
      )
      .addControl(
        new TextControl(this.editor, "host", node, false, "HOST", "127.0.0.1")
      )
      .addControl(
        new TextControl(this.editor, "port", node, false, "PORT", "3306")
      )
      .addControl(
        new TextControl(this.editor, "user", node, false, "USER", "guest")
      )
      .addControl(
        new TextControl(this.editor, "db", node, false, "DB_NAME", "foo")
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
    outputs.json = JSON.stringify({ status: "success" });
    outputs.sql = inputs.sql.length ? inputs.sql[0] : node.data.sql;
    outputs.tls = node.data.tls;
    outputs.host = node.data.host;
    outputs.port = node.data.port;
    outputs.user = node.data.user;
    outputs.db = node.data.db;
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
