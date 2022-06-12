import Rete from "rete";
import { SqlControl } from "../../controls/SqlControl";

export class SqlWithPlaceHolderComponent extends Rete.Component {
  path = ["New"];

  constructor(socket, jsonSocket) {
    super("SQLWithPlaceHolder");
    this.socket = socket;
    this.jsonSocket = jsonSocket;
  }

  builder(node) {
    const input = new Rete.Input(
      "placeHolderParams",
      "placeHolderParams (JSON)",
      this.jsonSocket
    );
    const out = new Rete.Output("sql", "SQL", this.socket);

    return node
      .addInput(input)
      .addControl(new SqlControl(this.editor, "sql", node))
      .addOutput(out);
  }

  worker(node, _, outputs) {
    outputs.sql = node.data.sql;
    outputs.placeHolderParams = node.data.placeHolderParams;
  }
}
