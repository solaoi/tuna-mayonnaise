import Rete from "rete";
import { UrlWithPathParamControl } from "../../controls/UrlWithPathParamControl";

export class UrlWithPathParamComponent extends Rete.Component {
  path = ["New"];

  constructor(socket, jsonSocket) {
    super("URLWithPathParam");
    this.socket = socket;
    this.jsonSocket = jsonSocket;
  }

  builder(node) {
    const input = new Rete.Input(
      "pathParams",
      "PathParams (JSON)",
      this.jsonSocket
    );
    const out = new Rete.Output("url", "URL", this.socket);

    return node
      .addInput(input)
      .addControl(
        new UrlWithPathParamControl(this.editor, "unFormattedUrl", node)
      )
      .addOutput(out);
  }

  worker(node, inputs) {
    const pathParams = inputs.pathParams.length
      ? inputs.pathParams[0]
      : node.data.pathParams;
    const { unFormattedUrl } = node.data;

    if (
      pathParams &&
      (unFormattedUrl.startsWith("https://") ||
        unFormattedUrl.startsWith("http://"))
    ) {
      const urlElements = unFormattedUrl.split("/");
      if (urlElements.length > 3) {
        const formatterUrl = `${urlElements[0]}//${urlElements[2]}/${urlElements
          .filter((_, i) => i > 2)
          .map((v) => {
            if (v.startsWith(":")) {
              const key = v.slice(1);
              return JSON.parse(pathParams)[key] || v;
            }
            return v;
          })
          .join("/")}`;

        this.editor.nodes
          .find((n) => n.id === node.id)
          .controls.get("unFormattedUrl")
          .setValue(unFormattedUrl, formatterUrl);
      }
    }
  }
}
