import Rete from "rete";

class NumControl extends Rete.Control {
  static component = ({ value, onChange, title, disabled }) => (
    <>
      {title && (
        <label style={{ color: "white", display: "block", textAlign: "left" }}>
          {title}
        </label>
      )}
      <input
        type="number"
        value={value}
        ref={(ref) => {
          ref &&
            ref.addEventListener("pointerdown", (e) => e.stopPropagation());
        }}
        onChange={(e) => onChange(+e.target.value)}
        disabled={disabled}
      />
    </>
  );

  constructor(
    emitter,
    key,
    node,
    readonly = false,
    title = "",
    defalut = 0,
    disabled = false
  ) {
    super(key);
    this.emitter = emitter;
    this.key = key;
    this.component = NumControl.component;

    const initial = node.data[key] || defalut;

    node.data[key] = initial;
    node.data["output"] = initial;
    this.props = {
      readonly,
      value: initial,
      title,
      disabled,
      onChange: (v) => {
        this.setValue(v);
        this.emitter.trigger("process");
      },
    };
  }

  setValue(val, disabled = false) {
    this.props.value = val;
    this.props.disabled = disabled;
    this.putData(this.key, val);
    this.putData("output", val);
    this.update();
  }
}

export default NumControl;
