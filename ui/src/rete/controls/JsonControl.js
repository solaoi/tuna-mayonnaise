import Rete from "rete";

class JsonControl extends Rete.Control {
  static component = ({ value, onChange }) => (
    <textarea
      value={value}
      rows={10}
      ref={(ref) => {
        ref && ref.addEventListener("pointerdown", (e) => e.stopPropagation());
      }}
      onChange={(e) => onChange(String(e.target.value))}
    />
  );

  constructor(emitter, key, node, readonly = false) {
    super(key);
    this.emitter = emitter;
    this.key = key;
    this.component = JsonControl.component;

    const initial = node.data[key] || `{"name": "value"}`;

    node.data[key] = initial;
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
    this.update();
  }
}

export default JsonControl;
