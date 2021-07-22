import Rete from "rete";

class BooleanControl extends Rete.Control {
  static component = ({
    checked,
    onChange,
    title,
    id = new Date().getTime(),
  }) => (
    <>
      {title && (
        <div
          style={{
            color: "white",
            textAlign: "left",
            marginBottom: "5px",
          }}
        >
          {title}
        </div>
      )}
      <div class="switchArea">
        <input
          type="checkbox"
          id={id}
          checked={checked}
          ref={(ref) => {
            ref &&
              ref.addEventListener("pointerdown", (e) => e.stopPropagation());
          }}
          onChange={(e) => onChange(+e.target.checked)}
        />
        <label for={id}>
          <span></span>
        </label>
        <div class="swImg"></div>
      </div>
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
