import Rete from "rete";

export class EndpointControl extends Rete.Control {
  static component = ({ value, contentType, onChange }) => (
    <>
      <label style={{ color: "white", display: "block", textAlign: "left" }}>
        Preview
      </label>
      {contentType === "text/html; charset=utf-8" ? (
        <iframe
          style={{ backgroundColor: "white" }}
          title="preview"
          srcDoc={value}
          width={600}
          height={400}
        />
      ) : (
        <textarea
          value={value}
          rows={10}
          ref={(ref) =>
            ref &&
            ref.addEventListener("pointerdown", (e) => e.stopPropagation())
          }
          onChange={(e) => onChange(String(e.target.value))}
          disabled
        />
      )}
    </>
  );

  constructor(emitter, controlName, node, readonly = false) {
    super(controlName);

    this.emitter = emitter;
    this.component = EndpointControl.component;
    this.props = {
      readonly,
      value: "",
      contentType: "",
      onChange: () => {},
    };
    node.data.output = "";
  }

  setValue(inputs, outputValue, contentType, enabledFlag, path) {
    this.props.value = outputValue;
    this.props.contentType = contentType;
    this.putData("enabledFlag", enabledFlag);
    this.putData("output", outputValue);
    this.putData("contentType", contentType);
    this.putData("path", path);

    Object.entries(inputs).forEach(([key, value]) => {
      if (value[0]) {
        this.putData(key, value[0]);
      }
    });
    this.update();
  }
}
