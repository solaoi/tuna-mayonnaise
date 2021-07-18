import Rete from "rete";
import TextControl from "../controls/TextControl";
import { DbNode } from "../nodes/DbNode";

class MySQLComponent extends Rete.Component {
  path = ["New"];
  constructor(jsonSocket, sqlSocket) {
    super("MySQL");
    this.data.component = DbNode; // optional
    this.jsonSocket = jsonSocket;
    this.sqlSocket = sqlSocket;
  }

  builder(node) {
    const jsonInput = new Rete.Input("json", "Dummy Output (JSON)", this.jsonSocket);
    const out = new Rete.Output("json", "JSON", this.jsonSocket);
    const sqlInput = new Rete.Input("sql", "SQL", this.sqlSocket);

    return node
      .addInput(sqlInput)
      .addInput(jsonInput)
      .addControl(new TextControl(this.editor, "tls", node, false, "TLS", "false"))
      .addControl(new TextControl(this.editor, "host", node, false, "HOST", "127.0.0.1"))
      .addControl(new TextControl(this.editor, "port", node, false, "PORT", "3306"))
      .addControl(new TextControl(this.editor, "user", node, false, "USER", "guest"))
      .addControl(new TextControl(this.editor, "db", node, false, "DB_NAME", "foo"))
      .addOutput(out);
  }

  worker(node, inputs, outputs) {
    outputs["json"] = inputs["json"].length ? inputs["json"][0] : node.data.json;
    outputs["sql"] = inputs["sql"].length ? inputs["sql"][0] : node.data.sql;
    outputs["tls"] = node.data.tls;
    outputs["host"] = node.data.host;
    outputs["port"] = node.data.port;
    outputs["user"] = node.data.user;
    outputs["db"] = node.data.db;
  }
}

export default MySQLComponent;
