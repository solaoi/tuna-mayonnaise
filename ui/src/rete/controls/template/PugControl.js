import Rete from "rete";
import EditablePugComponent from "./EditablePugComponent";

class PugControl extends Rete.Control {
  static component = ({ value, onChange }) => (
    <div
      ref={(ref) => {
        ref && ref.addEventListener("pointerdown", (e) => e.stopPropagation());
      }}
    >
      <EditablePugComponent value={value} onChange={(v) => onChange(v)} />
    </div>
  );

  constructor(emitter, key, node, readonly = false) {
    super(key);
    this.emitter = emitter;
    this.key = key;
    this.component = PugControl.component;

    const initial = node.data[key] || "div #{name}";

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

export default PugControl;
