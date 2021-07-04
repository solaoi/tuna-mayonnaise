import Rete from "rete";

class SqlControl extends Rete.Control {
  static component = ({ value, onChange, title, placeHolder }) => (
    <>
      {title && <label style={{color: 'white', display: 'block', textAlign: 'left'}}>{title}</label>}
      <input
        type="text"
        value={value}
        placeholder={placeHolder}
        ref={(ref) => {
          ref && ref.addEventListener("pointerdown", (e) => e.stopPropagation());
        }}
        onChange={(e) => onChange(String(e.target.value))}
      />
    </>
  );

  constructor(emitter, key, node, readonly = false, title = "", placeHolder = "") {
    super(key);
    this.emitter = emitter;
    this.key = key;
    this.component = SqlControl.component;

    const initial = node.data[key] || "";

    node.data[key] = initial;
    node.data["output"] = initial;
    this.props = {
      readonly,
      value: initial,
      title,
      placeHolder,
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

export default SqlControl;
