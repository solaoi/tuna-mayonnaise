import Rete from "rete";
import React from "react";
import Modal from "react-modal";

export class JsonManagerControl extends Rete.Control {
  static component = ({
    inputs,
    outputs,
    onPointerDown,
    onPointerOver,
    onPointerOut,
    onClickCloseBtn,
    isModalOpen,
    setModalOpen,
    functions,
    onClickAddBtn,
    onChangeModalFunc,
    outputFunctions,
    onClickRemoveBtn,
    onChangeModalFuncParams,
    textAreaRef,
    previewRef,
  }) => (
    <div className="jsonManagerCtrl">
      <Modal isOpen={isModalOpen} style={{ content: { padding: "0px" } }}>
        <div className="jsonManagerModalTitle">
          <p
            style={{
              display: "inline-block",
              fontWeight: "600",
              fontSize: "18px",
            }}
          >
            Functions
          </p>
          <span
            role="button"
            tabIndex="0"
            className="closeBtn"
            onClick={() => setModalOpen(false)}
          />
        </div>
        <div className="jsonManagerModalContent">
          <select
            style={{ color: "#767676" }}
            ref={(ref) =>
              ref &&
              ref.addEventListener("pointerdown", (e) => e.stopPropagation())
            }
          >
            <option value="" style={{ display: "none" }}>
              Select your function
            </option>
            {functions.map((v) => (
              <option value={v.name}>{v.name}</option>
            ))}
          </select>
          <div
            role="button"
            tabIndex="0"
            className="modalAddBtn"
            onClick={onClickAddBtn}
          >
            Add
          </div>
          {outputFunctions.map((v, idx) => (
            <div className="modalFunction">
              <p className="modalFunctionTitle">
                {v.func}
                <span
                  role="button"
                  tabIndex="0"
                  className="removeBtn"
                  onClick={onClickRemoveBtn}
                  data-idx={idx}
                />
              </p>
              <div className="modalFunctionKey">
                <p className="modalFunctionKeyTitle">name:</p>
                <input
                  type="text"
                  value={v.name}
                  placeholder="name to use output"
                  ref={(ref) => {
                    ref &&
                      ref.addEventListener("pointerdown", (e) =>
                        e.stopPropagation()
                      );
                  }}
                  onChange={onChangeModalFunc}
                  data-idx={idx}
                  style={{
                    background: v.warn ? "rgba(255, 0, 80, 0.7)" : "#FFF",
                  }}
                />
              </div>
              <div className="modalFunctionKey">
                <p className="modalFunctionKeyTitle">params: </p>
                <div className="modalFunctionContent">
                  {(() => {
                    const func = functions.filter((f) => f.name === v.func)[0];
                    if (func.paramCount === 1) {
                      return (
                        <input
                          className="modalFunctionContentInput"
                          list="inputs-datalist"
                          name={`func-${idx}_0`}
                          placeholder="Input or Select your param"
                          onChange={onChangeModalFuncParams}
                          data-idx={idx}
                          data-params-idx={0}
                          value={v.params[0] ? v.params[0] : null}
                        />
                      );
                    }
                    return (
                      <>
                        <input
                          className="modalFunctionContentInput"
                          list="inputs-datalist"
                          name={`func-${idx}_0`}
                          placeholder="Input or Select your param"
                          onChange={onChangeModalFuncParams}
                          data-idx={idx}
                          data-params-idx={0}
                          value={v.params[0] ? v.params[0] : null}
                        />
                        <span className="modalFunctionContentSymbol">
                          {func.symbol}
                        </span>
                        <input
                          className="modalFunctionContentInput"
                          list="inputs-datalist"
                          name={`func-${idx}_1`}
                          placeholder="Input or Select your param"
                          onChange={onChangeModalFuncParams}
                          data-idx={idx}
                          data-params-idx={1}
                          value={v.params[1] ? v.params[1] : null}
                        />
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>
          ))}
          <datalist id="inputs-datalist">
            {inputs.map((input, i) => {
              try {
                const parsed = JSON.parse(input);

                return (() => {
                  const inputArray = Array.isArray(parsed)
                    ? [<option value={`inputs[${i}]`}>{`inputs[${i}]`}</option>]
                    : [];
                  return [
                    ...inputArray,
                    ...Object.keys(parsed).map((key) => (
                      <option value={`inputs[${i}].${key}`}>
                        {`inputs[${i}].${key}`}
                      </option>
                    )),
                  ];
                })();
              } catch {
                return "";
              }
            })}
          </datalist>
        </div>
      </Modal>
      <div className="jsonManagerCtrlInputs">
        <div className="jsonManagerCtrlInput">
          <p className="jsonManagerCtrlCategory">Inputs</p>
          {inputs.map((v, i) => {
            try {
              const parsed = JSON.parse(v);
              if (Array.isArray(parsed)) {
                return (
                  <div className="jsonManagerCtrlInputGroup">
                    <p className="jsonManagerCtrlInputTitle">input_{i}</p>
                    <p className="jsonManagerCtrlInputKey">Array</p>
                  </div>
                );
              }
              return (
                <div className="jsonManagerCtrlInputGroup">
                  <p className="jsonManagerCtrlInputTitle">inputs[{i}]</p>
                  {Object.keys(parsed).map((k) => (
                    <p
                      className="jsonManagerCtrlInputKey jsonManagerCtrlInputKeyHover"
                      onPointerDown={onPointerDown}
                      data-idx={i}
                    >
                      {k}
                    </p>
                  ))}
                </div>
              );
            } catch {
              return "";
            }
          })}
        </div>
        <div className="jsonManagerCtrlFunctions">
          <p className="jsonManagerCtrlCategory">
            Functions
            <span
              role="button"
              tabIndex="0"
              className="addBtn"
              onClick={() => setModalOpen(true)}
            />
          </p>
          <div className="jsonManagerCtrlInputGroup">
            {outputFunctions.map(
              (v, i) =>
                v.name !== "" && (
                  <p
                    className="jsonManagerCtrlInputKey jsonManagerCtrlInputKeyHover"
                    onPointerDown={onPointerDown}
                    data-idx={i}
                    data-type="func"
                  >
                    {v.name}
                    <span
                      role="button"
                      tabIndex="0"
                      className="removeBtn"
                      onClick={onClickRemoveBtn}
                      data-idx={i}
                    />
                  </p>
                )
            )}
          </div>
        </div>
      </div>
      <div className="jsonManagerCtrlHint">&gt;&gt;&gt;</div>
      <div className="jsonManagerCtrlOutputs">
        <div
          className="jsonManagerCtrlPreview"
          style={{
            height:
              textAreaRef &&
              previewRef &&
              textAreaRef.current &&
              previewRef.current
                ? `${
                    textAreaRef.current.scrollHeight +
                    previewRef.current.scrollHeight
                  }px`
                : "initial",
          }}
        >
          <p className="jsonManagerCtrlCategory" ref={previewRef}>
            Preview
          </p>
          <textarea
            disabled
            ref={textAreaRef}
            className="jsonManagerCtrlPreviewArea"
            value={
              outputs.length !== 0
                ? JSON.stringify(
                    Object.fromEntries(
                      outputs.map((v) => [v.key, JSON.parse(v.value)])
                    ),
                    null,
                    2
                  )
                : ""
            }
          />
        </div>
        <div
          className="jsonManagerCtrlOutput"
          onPointerOver={onPointerOver}
          onPointerOut={onPointerOut}
        >
          <p className="jsonManagerCtrlCategory">Outputs</p>
          <div className="jsonManagerCtrlOutputArea">
            {outputs.map((v) => (
              <p className="jsonManagerCtrlOutputKey">
                {v.key}
                <span
                  role="button"
                  tabIndex="0"
                  className="removeBtn"
                  onClick={onClickCloseBtn}
                  data-key={v.key}
                />
              </p>
            ))}
          </div>
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
      outputs: node.data.output ? JSON.parse(node.data.output) : [], // e.g. [{src: 0, key: "key", value: "value"}]
      state: {
        pointerPos: { x: 0, y: 0 },
        drag: {},
        selectedElement: {},
      },
      isDroppable: false,
      onPointerOver: () => {
        this.props.isDroppable = true;
      },
      onPointerOut: () => {
        this.props.isDroppable = false;
      },
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
        dragStyle.transition = ""; // アニメーションを無効にする
        dragStyle.pointerEvents = "none"; // DROP先のonPointerイベントが阻害されないようにする
        dragStyle.display = "none"; // 複製時は非表示
        dragStyle.position = "absolute"; // 複製時の位置を対象と同一に
        const keyMargin = 10;
        const offset =
          el.getBoundingClientRect().left -
          el.closest(".jsonManagerCtrl").getBoundingClientRect().left +
          keyMargin;
        dragStyle.left = `${offset}px`;
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
      onPointerUp: () => {
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
          const id = parseInt(selectedElement.dataset.idx, 10);
          const key = selectedElement.innerText;
          if (selectedElement.dataset.type !== "func") {
            // すでに同じキーが登録済みなら上書き
            if (this.props.outputs.filter((v) => v.key === key).length === 1) {
              this.props.outputs = this.props.outputs.map((v) => {
                if (v.key === key) {
                  return {
                    src: id,
                    key: v.key,
                    value: JSON.stringify(
                      JSON.parse(this.props.inputs[id])[v.key]
                    ),
                  };
                }
                return v;
              });
            } else {
              this.props.outputs.push({
                src: id,
                key,
                value: JSON.stringify(JSON.parse(this.props.inputs[id])[key]),
              });
            }
          } else {
            // function execute
            const { params } = this.props.outputFunctions[id];
            const func = this.props.functions.filter(
              (v) => v.name === this.props.outputFunctions[id].func
            )[0];
            const { paramCount, logic } = func;
            const p0 = (() => {
              if (params[0].startsWith("inputs[")) {
                const pattern = /^inputs\[(\d+)\](([^.]?)|\.(.*))$/;
                const result = pattern.exec(params[0]);
                const p0Id = result[1];
                const p0Key = result[4];
                return p0Key
                  ? JSON.parse(this.props.inputs[p0Id])[p0Key]
                  : JSON.parse(this.props.inputs[p0Id]);
              }
              return params[0];
            })();
            const p1 = (() => {
              if (paramCount === 2 && params[1].startsWith("inputs[")) {
                const pattern = /^inputs\[(\d+)\](([^.]?)|\.(.*))$/;
                const result = pattern.exec(params[1]);
                const p1Id = result[1];
                const p1Key = result[4];
                return p1Key
                  ? JSON.parse(this.props.inputs[p1Id])[p1Key]
                  : JSON.parse(this.props.inputs[p1Id]);
              }
              return params[1];
            })();
            const value = paramCount === 1 ? logic(p0) : logic(p0, p1);

            if (this.props.outputs.filter((v) => v.key === key).length === 1) {
              this.props.outputs = this.props.outputs.map((v) => {
                if (v.key === key) {
                  return {
                    src: (id + 1) * -1,
                    key: v.key,
                    value: JSON.stringify(value),
                  };
                }
                return v;
              });
            } else {
              this.props.outputs.push({
                src: (id + 1) * -1,
                key,
                value: JSON.stringify(value),
              });
            }
          }
          this.putData("output", JSON.stringify(this.props.outputs));
          this.update();
          this.emitter.trigger("process");
        }
        drag.dragElement.remove();
      },
      onClickCloseBtn: (e) => {
        const el = e.currentTarget;
        this.props.outputs = this.props.outputs.reduce((a, c) => {
          if (c.key === el.dataset.key) return a;
          return [...a, c];
        }, []);
        this.putData("output", JSON.stringify(this.props.outputs));
        this.update();
        this.emitter.trigger("process");
      },
      isModalOpen: false,
      setModalOpen: (b) => {
        this.props.isModalOpen = b;
        this.update();
        this.emitter.trigger("process");
      },
      outputFunctions:
        !(
          Array.isArray(node.data.outputFunctions) &&
          node.data.outputFunctions.length === 0
        ) && node.data.outputFunctions
          ? JSON.parse(node.data.outputFunctions)
          : [], // [{func: "Rename", name: "hoge", params: ["inputs[0].hoge", "value2"]}]
      functions: [
        {
          name: "Rename",
          paramCount: 1,
          symbol: null,
          logic: (param) => param,
        },
        // {
        //   name: "1000 Separate",
        //   paramCount: 1,
        //   symbol: null,
        //   logic: (param) => {
        //     const s = String(param).split(".");
        //     let ret = String(s[0]).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
        //     if (s.length > 1) {
        //       ret += `.${s[1]}`;
        //     }
        //     return ret;
        //   },
        // },
        // {
        //   name: "Equal",
        //   paramCount: 2,
        //   symbol: "=",
        //   logic: (param1, param2) => param1 === param2,
        // },
        // {
        //   name: "NotEquals",
        //   paramCount: 2,
        //   symbol: "!=",
        //   logic: (param1, param2) => param1 !== param2,
        // },
        // {
        //   name: "GreaterThan",
        //   paramCount: 2,
        //   symbol: ">",
        //   logic: (param1, param2) => parseFloat(param1) > parseFloat(param2),
        // },
        // {
        //   name: "GreaterEqual",
        //   paramCount: 2,
        //   symbol: ">=",
        //   logic: (param1, param2) => parseFloat(param1) >= parseFloat(param2),
        // },
        // {
        //   name: "LessThan",
        //   paramCount: 2,
        //   symbol: "<",
        //   logic: (param1, param2) => parseFloat(param1) < parseFloat(param2),
        // },
        // {
        //   name: "LessEqual",
        //   paramCount: 2,
        //   symbol: "<=",
        //   logic: (param1, param2) => parseFloat(param1) <= parseFloat(param2),
        // },
        // {
        //   name: "And",
        //   paramCount: 2,
        //   symbol: "&&",
        //   logic: (param1, param2) => param1 === "true" && param2 === "true",
        // },
        // {
        //   name: "Or",
        //   paramCount: 2,
        //   symbol: "||",
        //   logic: (param1, param2) => param1 === "true" || param2 === "true",
        // },
        // // {name: "Map", paramCount: 1, symbol: null},
        // {
        //   name: "IndexOrKey",
        //   paramCount: 2,
        //   symbol: "has the item",
        //   logic: (param1, param2) => {
        //     try {
        //       const arr = JSON.parse(param1);
        //       return arr[param2] ? arr[param2] : "undefined";
        //     } catch (e) {
        //       return "no item...";
        //     }
        //   },
        // },
        // {
        //   name: "Split",
        //   paramCount: 2,
        //   symbol: "is split by the separator",
        //   logic: (param1, param2) => param1.split(param2),
        // },
      ],
      onClickAddBtn: (e) => {
        const val = e.currentTarget.previousElementSibling.value;
        if (val === "") return;
        this.props.outputFunctions.push({
          func: val,
          name: "",
          params: [],
          warn: false,
        });
        this.putData(
          "outputFunctions",
          JSON.stringify(this.props.outputFunctions)
        );
        this.update();
        this.emitter.trigger("process");
      },
      onClickRemoveBtn: (e) => {
        const id = parseInt(e.currentTarget.dataset.idx, 10);
        const { name } = this.props.outputFunctions[id];
        this.props.outputs = this.props.outputs.filter((v) => v.key !== name);
        this.props.outputFunctions = this.props.outputFunctions.filter(
          (_, i) => i !== id
        );
        this.putData(
          "outputFunctions",
          JSON.stringify(this.props.outputFunctions)
        );
        this.update();
        this.emitter.trigger("process");
      },
      onChangeModalFunc: (e) => {
        const id = parseInt(e.currentTarget.dataset.idx, 10);
        if (
          this.props.outputFunctions.filter((v) => v.name === e.target.value)
            .length === 1
        ) {
          this.props.outputFunctions[id].warn = true;
        } else {
          this.props.outputFunctions[id].warn = false;
        }
        this.props.outputFunctions[id].name = e.target.value;
        this.putData(
          "outputFunctions",
          JSON.stringify(this.props.outputFunctions)
        );
        this.update();
        this.emitter.trigger("process");
      },
      onChangeModalFuncParams: (e) => {
        const id = parseInt(e.currentTarget.dataset.idx, 10);
        const paramsId = parseInt(e.currentTarget.dataset.paramsIdx, 10);
        if (
          paramsId === 2 &&
          this.props.outputFunctions[id].params.length < 2
        ) {
          this.props.outputFunctions[id].params[0] = null;
        }
        this.props.outputFunctions[id].params[paramsId] = e.target.value;
        this.putData(
          "outputFunctions",
          JSON.stringify(this.props.outputFunctions)
        );

        if (this.props.outputFunctions[id].name) {
          const paramName = this.props.outputFunctions[id].name;
          const { params } = this.props.outputFunctions[id];
          const func = this.props.functions.filter(
            (v) => v.name === this.props.outputFunctions[id].func
          )[0];
          const { paramCount, logic } = func;
          if (paramCount === 1 || params[0]) {
            const p0 = (() => {
              if (params[0].startsWith("inputs[")) {
                const pattern = /^inputs\[(\d+)\](([^.]?)|\.(.*))$/;
                const result = pattern.exec(params[0]);
                const p0Id = result[1];
                const p0Key = result[4];
                return p0Key
                  ? JSON.parse(this.props.inputs[p0Id])[p0Key]
                  : JSON.parse(this.props.inputs[p0Id]);
              }
              return params[0];
            })();
            const p1 = (() => {
              if (paramCount === 2 && params[1].startsWith("inputs[")) {
                const pattern = /^inputs\[(\d+)\](([^.]?)|\.(.*))$/;
                const result = pattern.exec(params[1]);
                const p1Id = result[1];
                const p1Key = result[4];
                return p1Key
                  ? JSON.parse(this.props.inputs[p1Id])[p1Key]
                  : JSON.parse(this.props.inputs[p1Id]);
              }
              return params[1];
            })();
            const value = paramCount === 1 ? logic(p0) : logic(p0, p1);
            if (
              this.props.outputs.filter((v) => v.key === paramName).length === 1
            ) {
              this.props.outputs = this.props.outputs.map((v) => {
                if (v.key === paramName) {
                  return {
                    src: (id + 1) * -1,
                    key: v.key,
                    value: JSON.stringify(value),
                  };
                }
                return v;
              });
            }
          }
        }

        this.update();
        this.emitter.trigger("process");
      },
      textAreaRef: React.createRef(),
      previewRef: React.createRef(),
    };
  }

  setValue(inputs) {
    const { content } = inputs;
    this.props.inputs = content;
    if (content.length === 0) {
      this.props.outputs = [];
      this.props.outputFunctions = [];
    }
    const elems = this.props.outputs.reduce((a, c) => {
      if (a.includes(c.src) || c.src < 0) return a;
      return [...a, c.src];
    }, []);
    if (elems.length > content.length) {
      this.props.outputs = [];
      this.props.outputFunctions = [];
    } else {
      // inputsの変更をoutputsに反映
      content.forEach(
        (v, i) =>
          (this.props.outputs = this.props.outputs.reduce((a, c) => {
            if (c.src === i) {
              const parsed = JSON.parse(v);
              if (!Object.keys(parsed).includes(c.key)) return a; // キー名自体に変更があった場合はOutputから削除
              return [
                ...a,
                {
                  src: c.src,
                  key: c.key,
                  value: JSON.stringify(parsed[c.key]),
                },
              ];
            }
            return [...a, c];
          }, []))
      );
      // inputsを参照するfunctionがある場合
      const hasReferenceFromFuncs = this.props.outputFunctions.filter(
        (v) =>
          v.name &&
          v.params.reduce((a, c) => {
            if (a) return a;
            return c.startsWith("inputs[");
          }, false)
      ).length;
      if (hasReferenceFromFuncs) {
        this.props.outputFunctions.forEach((f, i) => {
          try {
            const paramName = f.name;
            const { params } = f;
            const func = this.props.functions.filter(
              (v) => v.name === f.func
            )[0];
            const { paramCount, logic } = func;
            if (paramCount === 1 || params[0]) {
              const p0 = (() => {
                if (
                  params[0] !== undefined &&
                  params[0].startsWith("inputs[")
                ) {
                  const pattern = /^inputs\[(\d+)\](([^.]?)|\.(.*))$/;
                  const result = pattern.exec(params[0]);
                  const id = result[1];
                  const key = result[4];
                  const p = key
                    ? JSON.parse(this.props.inputs[id])[key]
                    : JSON.parse(this.props.inputs[id]);
                  if (p === undefined) throw Error;
                  return p;
                }
                return params[0];
              })();
              const p1 = (() => {
                if (
                  paramCount === 2 &&
                  params[1] !== undefined &&
                  params[1].startsWith("inputs[")
                ) {
                  const pattern = /^inputs\[(\d+)\](([^.]?)|\.(.*))$/;
                  const result = pattern.exec(params[1]);
                  const id = result[1];
                  const key = result[4];
                  const p = key
                    ? JSON.parse(this.props.inputs[id])[key]
                    : JSON.parse(this.props.inputs[id]);
                  if (p === undefined) throw Error;
                  return p;
                }
                return params[1];
              })();
              const value = paramCount === 1 ? logic(p0) : logic(p0, p1);
              if (
                this.props.outputs.filter((v) => v.key === paramName).length ===
                1
              ) {
                this.props.outputs = this.props.outputs.map((v) => {
                  if (v.key === paramName) {
                    return {
                      src: v.src,
                      key: v.key,
                      value: JSON.stringify(value),
                    };
                  }
                  return v;
                });
              }
            }
            // JSON.parseでエラーが既に存在しないinputを参照するとき発生するので
          } catch (e) {
            // outputからの削除処理、該当のfunctionを削除する
            this.props.outputs = this.props.outputs.filter(
              (v) => v.key !== this.props.outputFunctions[i].name
            );
            delete this.props.outputFunctions[i];
          }
        });
        this.props.outputFunctions = this.props.outputFunctions.filter(
          (v) => v !== undefined
        );
      }
    }

    this.putData("output", JSON.stringify(this.props.outputs));
    this.update();
  }
}
