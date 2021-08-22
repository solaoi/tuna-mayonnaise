import Rete from "rete";

export class HTMLControl extends Rete.Control {
  static component = ({ value, onChange }) => (
    <>
      <label style={{ color: "white", display: "block", textAlign: "left" }}>
        Preview
      </label>
      <textarea
        value={value}
        rows={10}
        ref={(ref) =>
          ref && ref.addEventListener("pointerdown", (e) => e.stopPropagation())
        }
        onChange={(e) => onChange(String(e.target.value))}
        disabled
      />
    </>
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
    node.data.output = "";
  }

  setValue(inputs, outputValue, contentType) {
    this.props.value = outputValue;
    this.putData("output", outputValue);
    this.putData("contentType", contentType);
    Object.entries(inputs).forEach(([key, value]) => {
      if (value[0]) {
        this.putData(key, value[0]);
      }
    });
    this.update();
  }
}
