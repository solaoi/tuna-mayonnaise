import Rete from "rete";
import { EditableHtmlComponent } from "./EditableHtmlComponent";

export class RawHTMLControl extends Rete.Control {
  static component = ({ value, onChange }) => (
    <div
      ref={(ref) =>
        ref && ref.addEventListener("pointerdown", (e) => e.stopPropagation())
      }
    >
      <EditableHtmlComponent value={value} onChange={(v) => onChange(v)} />
    </div>
  );

  constructor(emitter, key, node, readonly = false) {
    super(key);
    this.emitter = emitter;
    this.key = key;
    this.component = RawHTMLControl.component;

    const initial =
      node.data[key] ||
      `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>REPLACE HERE!</title>
        <!-- <link rel="stylesheet" href="style.css"> -->
      </head>
      <body>
      <!-- <script src="index.js"></script> -->
      </body>
    </html>`;

    node.data[key] = initial;
    node.data.output = initial;
    this.props = {
      readonly,
      value: initial,
      onChange: (v) => {
        this.setValue(v);
        this.emitter.trigger("process");
      },
    };
  }

  setValue(val) {
    this.props.value = val;
    this.putData(this.key, val);
    this.putData("output", val);
    this.update();
  }
}
