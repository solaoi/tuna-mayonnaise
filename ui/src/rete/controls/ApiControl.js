import Rete from "rete";

class ApiControl extends Rete.Control {
  static component = () => null;

  constructor(emitter, key, node, readonly = false) {
    super(key);
    this.emitter = emitter;
    this.key = key;
    this.component = ApiControl.component;

    const initial = node.data[key] || `{"name": "value"}`;

    node.data[key] = initial;
    node.data["output"] = initial;
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
    this.putData(this.key, val);
    this.putData("output", null);
    this.update();
  }
}

export default ApiControl;
