import Rete from "rete";
import { EditableUrlComponent } from "./EditableUrlComponent";

export class UrlWithPathParamControl extends Rete.Control {
  static component = ({ value, onChange, preview }) => (
    <>
      <label style={{ color: "white", display: "block", textAlign: "left" }}>
        Preview
      </label>
      <textarea value={preview} rows={1} disabled />
      <div
        ref={(ref) =>
          ref && ref.addEventListener("pointerdown", (e) => e.stopPropagation())
        }
      >
        <EditableUrlComponent value={value} onChange={(v) => onChange(v)} />
      </div>
    </>
  );

  constructor(emitter, key, node, readonly = false) {
    super(key);
    this.emitter = emitter;
    this.key = key;
    this.component = UrlWithPathParamControl.component;

    const initial = node.data[key] || `https://example.com`;

    node.data[key] = initial;
    node.data.output = initial;
    this.props = {
      readonly,
      value: initial,
      preview: initial,
      onChange: (v) => {
        this.setValue(v);
        this.emitter.trigger("process");
      },
    };
  }

  setValue(val, preview) {
    this.props.preview = preview;
    this.props.value = val;
    this.putData(this.key, val);
    this.putData("output", val);
    this.update();
  }
}
