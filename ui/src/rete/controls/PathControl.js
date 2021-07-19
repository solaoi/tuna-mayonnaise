import Rete from "rete";
import { toast } from "react-toastify";

class PathControl extends Rete.Control {
  static component = ({ value, onChange, title, placeHolder, warn }) => (
    <>
      {title && (
        <label style={{ color: "white", display: "block", textAlign: "left" }}>
          {title}
        </label>
      )}
      <input
        type="text"
        value={value}
        placeholder={placeHolder}
        ref={(ref) => {
          ref &&
            ref.addEventListener("pointerdown", (e) => e.stopPropagation());
        }}
        onChange={(e) => onChange(String(e.target.value))}
        style={{ background: warn ? "rgba(255, 0, 80, 0.7)" : "#FFF" }}
      />
    </>
  );

  constructor(
    emitter,
    key,
    node,
    readonly = false,
    title = "",
    placeHolder = "",
    warn = false
  ) {
    super(key);
    this.emitter = emitter;
    this.key = key;
    this.component = PathControl.component;

    const initial = node.data[key] || "/foo";

    node.data[key] = initial;
    node.data["output"] = initial;
    this.props = {
      readonly,
      value: initial,
      title,
      placeHolder,
      warn,
      onChange: (v) => {
        if (v === "") {
          this.props.warn = true;
        } else if (v === "/metrics" || v === "/health") {
          this.props.warn = true;
          toast.error("this Path is reserved, use another Path.");
        } else {
          this.props.warn = false;
        }
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

export default PathControl;
