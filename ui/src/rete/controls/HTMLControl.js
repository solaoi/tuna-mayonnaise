import Rete from "rete";

class HTMLControl extends Rete.Control {
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

  constructor(emitter, controlName, node, readonly = false) {
    super(controlName);

    this.emitter = emitter;
    this.keys = [];
    this.component = HTMLControl.component;
    this.props = {
      readonly,
      value: "",
      onChange: () => {},
    };
  }

  setValue(inputs, controlName, controlValue, controlType) {
    this.props.value = controlValue;
    this.putData(controlName, controlValue);
    this.putData("contentType", controlType);
    for (const key in inputs) {
      if (inputs[key][0]) {
        this.putData(key, inputs[key][0]);
      }
    }
    this.update();
  }
}

export default HTMLControl;
