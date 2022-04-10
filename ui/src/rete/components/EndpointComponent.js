import Rete from "rete";
import { EndpointNode } from "../nodes/EndpointNode";
import { EndpointControl } from "../controls/EndpointControl";
import { BooleanControl } from "../controls/BooleanControl";
import { TextControl } from "../controls/TextControl";
import { PathControl } from "../controls/PathControl";
import { NumControl } from "../controls/NumControl";
import { SelectControl } from "../controls/SelectControl";

export class EndpointComponent extends Rete.Component {
  path = ["New"];

  constructor(stringSocket) {
    super("Endpoint");
    this.data.component = EndpointNode; // optional
    this.stringSocket = stringSocket;
  }

  builder(node) {
    node.data.enabledFlag = node.data.enabledFlag ?? true;
    const contentInput = new Rete.Input(
      "content",
      "Content (JSON/HTML)",
      this.stringSocket
    );
    contentInput.addControl(new TextControl(this.editor, "content", node));

    return node
      .addInput(contentInput)
      .addControl(new EndpointControl(this.editor, "endpoint", node, true))
      .addControl(
        new BooleanControl(this.editor, "enabledFlag", node, false, "Enabled")
      )
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
        new PathControl(this.editor, "path", node, false, "Path", "/foo")
      )
      .addControl(
        new BooleanControl(
          this.editor,
          "botblockerEnableFlag",
          node,
          false,
          "BotBlocker"
        )
      )
      .addControl(
        new BooleanControl(
          this.editor,
          "ratelimitEnableFlag",
          node,
          false,
          "RateLimit"
        )
      )
      .addControl(
        new SelectControl(this.editor, "ratelimitUnit", node, false, "Unit", [
          "any",
          "ip",
        ])
      )
      .addControl(
        new NumControl(this.editor, "ratelimitLimit", node, false, "Limit", 30)
      )
      .addControl(
        new NumControl(this.editor, "ratelimitBurst", node, false, "Burst", 0)
      )
      .addControl(
        new NumControl(
          this.editor,
          "ratelimitExpireSecond",
          node,
          false,
          "ExpireSecond",
          60
        )
      );
  }

  worker(node, inputs) {
    const content = inputs.content.length ? inputs.content[0] : "Rendering...";
    const contentType = ((connection) => {
      if (connection) {
        if (connection.output === "html") {
          return "text/html; charset=utf-8";
        }
        if (connection.output === "json") {
          return "application/json; charset=utf-8";
        }
      }
      return "text/plain; charset=utf-8";
    })(node.inputs.content.connections[0]);
    const { enabledFlag } = node.data;
    const { path } = node.data;

    this.editor.nodes
      .find((n) => n.id === node.id)
      .controls.get("endpoint")
      .setValue(inputs, content, contentType, enabledFlag, path);

    [
      "ratelimitUnit",
      "ratelimitLimit",
      "ratelimitBurst",
      "ratelimitExpireSecond",
    ].forEach((v) => {
      this.editor.nodes
        .find((n) => n.id === node.id)
        .controls.get(v)
        .setValue(
          node.data[v],
          !node.data.ratelimitEnableFlag,
          !node.data.ratelimitEnableFlag
        );
    });

    const conns = this.editor.nodes
      .find((n) => n.id === node.id)
      .getConnections();
    if (conns.length > 0) {
      conns.forEach((c) => this.editor.view.connections.get(c).update());
    }
  }
}
