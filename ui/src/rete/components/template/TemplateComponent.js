import Rete from "rete";
/* eslint import/no-unresolved: 0 */
import pug from "pug";
import Handlebars from "handlebars";
import { TemplateNode } from "../../nodes/TemplateNode";
import { JsonControl } from "../../controls/JsonControl";
import { HTMLControl } from "../../controls/HTMLControl";

export class TemplateComponent extends Rete.Component {
  path = ["New"];

  constructor(dataSocket, templateSocket, htmlSocket) {
    super("Template");
    this.data.component = TemplateNode; // optional
    this.dataSocket = dataSocket;
    this.templateSocket = templateSocket;
    this.htmlSocket = htmlSocket;
  }

  builder(node) {
    const templateEngineInput = new Rete.Input(
      "template",
      "TemplateEngine",
      this.templateSocket
    );
    const jsonInput = new Rete.Input("json", "Data (JSON)", this.dataSocket);
    const out = new Rete.Output("html", "HTML", this.htmlSocket);

    jsonInput.addControl(new JsonControl(this.editor, "json", node));

    return node
      .addInput(templateEngineInput)
      .addInput(jsonInput)
      .addControl(new HTMLControl(this.editor, "template", node, true))
      .addOutput(out);
  }

  worker(node, inputs, outputs) {
    const json = inputs.json.length ? inputs.json[0] : node.data.json;
    const connections = node.inputs.template.connections.filter(
      (conn) => conn?.output === "hbs" || conn?.output === "pug"
    );
    const html = (() => {
      if (connections.length === 0) {
        return "No TemplateEngine detected...";
      }
      const templateEngine = connections[0].output;
      const template = inputs.template?.length
        ? inputs.template[0]
        : node.data.json;
      if (templateEngine === "pug") {
        return pug.render(template, JSON.parse(json));
      }
      if (templateEngine === "hbs") {
        const hbsTemplate = Handlebars.compile(template);
        return hbsTemplate(JSON.parse(json));
      }
      return "Unknown TemplateEngine detected...";
    })();

    this.editor.nodes
      .find((n) => n.id === node.id)
      .controls.get("template")
      .setValue(inputs, html, "text/html; charset=utf-8");
    outputs.html = html;
  }
}
