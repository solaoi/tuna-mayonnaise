import Rete from "rete";

class BooleanControl extends Rete.Control {
  static component = ({ checked, onChange, title }) => (
    <>
      {title && <label style={{color: 'white', display: 'block', textAlign: 'left'}}>{title}</label>}
      <input
        type="checkbox"
        checked={checked}
        ref={(ref) => {
          ref && ref.addEventListener("pointerdown", (e) => e.stopPropagation());
        }}
        onChange={(e) => onChange(+e.target.checked)}
      />
    </>
  );

  constructor(emitter, key, node, readonly = false, title = "") {
    super(key);
    this.emitter = emitter;
    this.key = key;
    this.component = BooleanControl.component;

    const initial = node.data[key] || false;

    node.data[key] = initial;
    node.data["output"] = initial;
    this.props = {
      readonly,
      checked: initial,
      title,
      onChange: (v) => {
        this.setValue(!!v);
        this.emitter.trigger("process");
      },
    };
  }

  setValue(val) {
    this.props.checked = val;
    this.putData(this.key, val);
    this.putData("output", val);
    this.update();
  }
}

export default BooleanControl;
