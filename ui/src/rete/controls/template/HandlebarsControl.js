import Rete from "rete";
import EditableHandlebarsComponent from "./EditableHandlebarsComponent";

class HandlebarsControl extends Rete.Control {
  static component = ({ value, onChange }) => (
    <div
      ref={(ref) => {
        ref && ref.addEventListener("pointerdown", (e) => e.stopPropagation());
      }}
    >
      <EditableHandlebarsComponent
        value={value}
        onChange={(v) => onChange(v)}
      />
    </div>
  );

  constructor(emitter, key, node, readonly = false) {
    super(key);
    this.emitter = emitter;
    this.key = key;
    this.component = HandlebarsControl.component;

    const initial = node.data[key] || "<div>{{name}}</div>";

    node.data[key] = initial;
    node.data["output"] = initial;
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

export default HandlebarsControl;
