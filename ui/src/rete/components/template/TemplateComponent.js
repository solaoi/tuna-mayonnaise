import Rete from "rete";
import { TemplateNode } from "../../nodes/TemplateNode";
import JsonControl from "../../controls/JsonControl";
import HTMLControl from "../../controls/HTMLControl";
import * as ejs from "ejs";
import * as pug from 'pug';
import Handlebars from "handlebars";

class TemplateComponent extends Rete.Component {
  path = ["+ Template"];
  constructor(dataSocket, templateSocket, htmlSocket) {
    super("Template");
    this.data.component = TemplateNode; // optional
    this.dataSocket = dataSocket;
    this.templateSocket = templateSocket;
    this.htmlSocket = htmlSocket;
  }

  builder(node) {
    var inp1 = new Rete.Input("template", "TemplateEngine", this.templateSocket);
    var inp2 = new Rete.Input("json", "Data (JSON Format)", this.dataSocket);
    var out = new Rete.Output("html", "Html", this.htmlSocket);

    // inp1.addControl(new EJSControl(this.editor, "template", node));
    inp2.addControl(new JsonControl(this.editor, "json", node));

    return node
      .addInput(inp1)
      .addInput(inp2)
      .addControl(new HTMLControl(this.editor, "preview", node, true))
      .addOutput(out);
  }

  worker(node, inputs, outputs) {
    const json = inputs["json"].length ? inputs["json"][0] : node.data.json;
    const connections = node.inputs.template.connections.filter(
      (conn) => conn?.output === "hbs" || conn?.output === "ejs" || conn?.output === "pug"
    );
    const html = (() => {
      if (connections.length === 0) {
        return "No TemplateEngine detected...";
      }
      const templateEngine = connections[0].output;
      const template = inputs["template"]?.length
        ? inputs["template"][0]
        : node.data.json;
      if (templateEngine === "ejs") {
        return ejs.render(template, JSON.parse(json));
      }
      if (templateEngine === "pug") {
        return pug.render(template, JSON.parse(json));
      }
      if (templateEngine === "hbs") {
        const hbsTemplate = Handlebars.compile(template);
        return hbsTemplate(JSON.parse(json));
      }
    })();
    this.editor.nodes
      .find((n) => n.id == node.id)
      .controls.get("preview")
      .setValue(html);
    outputs["html"] = html;
  }
}

export default TemplateComponent;
