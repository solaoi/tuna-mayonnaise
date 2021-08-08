import Rete from "rete";

class JsonManagerControl extends Rete.Control {
  static component = ({ inputs, outputs, onPointerDown, onPointerOver, onPointerOut, onClickCloseBtn }) => (
    <div className="jsonManagerCtrl" >
      <div className="jsonManagerCtrlInputs">
        <div className="jsonManagerCtrlInput">
          <p className="jsonManagerCtrlCategory">Input</p>
          {inputs.map((v, i)=>{
            try {
              const parsed = JSON.parse(v);
              if(Array.isArray(parsed)){
                return <div className="jsonManagerCtrlInputGroup">
                    <p className="jsonManagerCtrlInputTitle">input_{i}</p>
                    <p className="jsonManagerCtrlInputKey">Array</p>
                  </div>;
              }
              return <div className="jsonManagerCtrlInputGroup">
                  <p className="jsonManagerCtrlInputTitle">input_{i}</p>
                  {Object.keys(parsed)
                    .map(v => <p className="jsonManagerCtrlInputKey jsonManagerCtrlInputKeyHover" onPointerDown={onPointerDown} data-idx={i}>{v}</p>)}
                </div>;
            } catch {
              return ''
            }
          })}
        </div>
        <div className="jsonManagerCtrlFunctions">
          <p className="jsonManagerCtrlCategory">Functions</p>
        </div>
      </div>
      <div className="jsonManagerCtrlHint">&gt;&gt;&gt;</div>
      <div className="jsonManagerCtrlOutput" onPointerOver={onPointerOver} onPointerOut={onPointerOut} >
        <p className="jsonManagerCtrlCategory">Output</p>
        <div className="jsonManagerCtrlOutputArea">
          {outputs.map((v) => <p className="jsonManagerCtrlOutputKey">{v.key}<span className="closeBtn" onClick={onClickCloseBtn} data-key={v.key}></span></p>)}
        </div>
      </div>
    </div>
  );

  constructor(emitter, controlName, node, readonly = false) {
    super(controlName);

    this.emitter = emitter;
    this.component = JsonManagerControl.component;
    this.props = {
      readonly,
      inputs: [],
      outputs: node.data.output ? JSON.parse(node.data.output): [], // e.g. [{src: 0, key: "key", value: "value"}]
      state: {
        pointerPos: {x: 0, y: 0},
        drag: {},
        selectedElement: {}
      },
      isDroppable: false,
      onPointerOver: (e) => {this.props.isDroppable = true},
      onPointerOut: (e) => {this.props.isDroppable = false},
      onPointerDown: (e) => {
        // ドラッグする要素(DOM)
        const el = e.currentTarget;
        // マウスポインターの座標を保持しておく
        this.props.state.pointerPos.x = e.clientX;
        this.props.state.pointerPos.y = e.clientY;
        this.props.state.selectedElement = el;
        // ドラッグしている要素のスタイルを上書き
        const dragElement = el.cloneNode(true);
        const dragStyle = dragElement.style;
        dragStyle.transition = "";     // アニメーションを無効にする
        dragStyle.pointerEvents = "none"; // DROP先のonPointerイベントが阻害されないようにする
        dragStyle.display = "none"; // 複製時は非表示
        dragStyle.position = "absolute"; // 複製時の位置を対象と同一に
        const keyMargin = 10;
        const offset = el.getBoundingClientRect().left - el.closest(".jsonManagerCtrl").getBoundingClientRect().left + keyMargin;
        dragStyle.left = offset + "px";
        el.after(dragElement);
        // 要素の座標を取得
        const { left: x, top: y } = el.getBoundingClientRect();
        const position = { x, y };
        // ドラッグする要素を保持しておく
        this.props.state.drag = { dragElement, position };
        // pointermove, pointerupイベントを登録する
        el.classList.remove("jsonManagerCtrlInputKeyHover");
        const ctrl = el.closest(".node");
        ctrl.style.cursor = "grabbing"; // カーソルのデザインを変更
        ctrl.addEventListener("pointerup", this.props.onPointerUp);
        ctrl.addEventListener("pointermove", this.props.onPointerMove);
      },
      onPointerMove: (e) => {
        e.stopPropagation();
        const { clientX, clientY } = e;
        const { drag, pointerPos } = this.props.state;
        // マウスポインターの移動量を計算
        const x = clientX - pointerPos.x;
        const y = clientY - pointerPos.y;
        const dragStyle = drag.dragElement.style;
        // ドラッグ時に可視化
        dragStyle.display = "inline-block";
        // ドラッグ要素の座標とスタイルを更新
        dragStyle.zIndex = "100";
        dragStyle.transform = `translate(${x}px,${y}px)`;
      },
      onPointerUp: (e) => {
        const { drag, selectedElement } = this.props.state;
        this.props.state.drag = null;
        // 登録していたイベントを削除
        selectedElement.classList.add("jsonManagerCtrlInputKeyHover");
        const ctrl = selectedElement.closest(".node");
        ctrl.style.cursor = "pointer";
        ctrl.removeEventListener("pointerup", this.props.onPointerUp);
        ctrl.removeEventListener("pointermove", this.props.onPointerMove);
        // ドロップエリア内であれば、Outputに格納
        if (this.props.isDroppable) {
          const id = parseInt(selectedElement.dataset.idx);
          const key = selectedElement.innerText;
          // すでに同じキーが登録済みなら上書き
          if(this.props.outputs.filter(v => v.key === key).length === 1){
            this.props.outputs = this.props.outputs
            .map(v => {
              if(v.key === key) {
                return {src: id, key: v.key, value: JSON.parse(this.props.inputs[id])[v.key]};
              } else {
                return v;
              }
            });
          } else {
            this.props.outputs.push({src: id, key, value: JSON.parse(this.props.inputs[id])[key]});
          }
          this.putData("output", JSON.stringify(this.props.outputs));
          this.update();
          this.emitter.trigger("process");
        }
        drag.dragElement.remove();
      },
      onClickCloseBtn: (e)=>{
        const el = e.currentTarget;
        this.props.outputs = this.props.outputs.reduce((a,c) => {
          if(c.key === el.dataset.key) return a;
          return [...a, c]
        },[])
        this.putData("output", JSON.stringify(this.props.outputs));
        this.update();
        this.emitter.trigger("process");
      }
    };
  }

  setValue(inputs) {
    const content = inputs["content"];
    const elems = this.props.outputs.reduce((a,c)=>{
      if(a.includes(c.src)) return a;
      return [...a, c.src];
    },[]);
    if(elems.length > content.length) {
      this.props.outputs = []
    } else {
      // inputsの変更をoutputsに反映
      content.forEach((v, i) =>
        this.props.outputs = this.props.outputs.reduce((a,c) => {
          if (c.src === i){
            const parsed = JSON.parse(v);
            if(!Object.keys(parsed).includes(c.key)) return a; // キー名自体に変更があった場合はOutputから削除
            return [...a, {src: c.src, key: c.key, value: parsed[c.key]}];
          } else {
            return [...a, c];
          }
        }, [])
      );
    }
    this.props.inputs = content;

    this.putData("output", JSON.stringify(this.props.outputs));
    this.update();
  }
}

export default JsonManagerControl;
