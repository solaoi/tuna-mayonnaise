import Rete from "rete";
import { DefaultNode } from "../nodes/DefaultNode";
import { BooleanControl } from "../controls/BooleanControl";
import { PathControl } from "../controls/PathControl";
import { TextControl } from "../controls/TextControl";

export class RedirectEndpointComponent extends Rete.Component {
  path = ["New"];

  constructor() {
    super("RedirectEndpoint");
    this.data.component = DefaultNode; // optional
  }

  builder(node) {
    node.data.enabledFlag = node.data.enabledFlag ?? true;

    return node
      .addControl(
        new BooleanControl(this.editor, "enabledFlag", node, false, "Enabled")
      )
      .addControl(
        new PathControl(this.editor, "path", node, false, "Path", "/foo")
      )
      .addControl(
        new TextControl(
          this.editor,
          "url",
          node,
          false,
          "Url",
          "https://example.com"
        )
      );
  }

  worker(node, _, outputs) {
    outputs.enabledFlag = node.data.enabledFlag;
    outputs.path = node.data.path;
    outputs.url = node.data.url;
  }
}
