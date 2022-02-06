import Rete from "rete";

export class SelectControl extends Rete.Control {
  static component = ({ title, value, values, onChange, disabled }) => (
    <>
      {title && (
        <label style={{ color: "white", display: "block", textAlign: "left" }}>
          {title}
        </label>
      )}
      <select
        style={{ width: "100%" }}
        value={value}
        ref={(ref) =>
          ref && ref.addEventListener("pointerdown", (e) => e.stopPropagation())
        }
        onChange={(e) => onChange(String(e.target.value))}
        disabled={disabled}
      >
        {values.map((v, i) => (
          <option key={`${v}_${i}`} value={v}>
            {v}
          </option>
        ))}
      </select>
    </>
  );

  constructor(
    emitter,
    key,
    node,
    readonly = false,
    title = "",
    values = [],
    disabled = false
  ) {
    super(key);
    this.emitter = emitter;
    this.key = key;
    this.component = SelectControl.component;

    const initial = node.data[key] || values[0];

    node.data[key] = initial;
    node.data.output = initial;
    this.props = {
      readonly,
      value: initial,
      title,
      values,
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
