import Rete from "rete";
import { SqlControl } from "../../controls/SqlControl";

export class SqlComponent extends Rete.Component {
  path = ["New"];

  constructor(socket) {
    super("SQL");
    this.socket = socket;
  }

  builder(node) {
    const out1 = new Rete.Output("sql", "SQL", this.socket);

    return node
      .addControl(new SqlControl(this.editor, "sql", node))
      .addOutput(out1);
  }

  worker(node, inputs, outputs) {
    outputs.sql = node.data.sql;
  }
}
