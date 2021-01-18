import React from "react";
import Rete from "rete";
import ReactRenderPlugin from "rete-react-render-plugin";
import ConnectionPlugin from "rete-connection-plugin";
import AreaPlugin from "rete-area-plugin";
// import DockPlugin from "rete-dock-plugin";
import ContextMenuPlugin from "rete-context-menu-plugin";
import KeyboardPlugin from "rete-keyboard-plugin";
import CommentPlugin from "rete-comment-plugin";
import MinimapPlugin from "rete-minimap-plugin";
import ConnectionPathPlugin from "rete-connection-path-plugin";
import ConnectionReroutePlugin from "rete-connection-reroute-plugin";
import AutoArrangePlugin from "rete-auto-arrange-plugin";
import HistoryPlugin from "rete-history-plugin";

import AddComponent from "./rete/components/operator/AddComponent";
import SubtractComponent from "./rete/components/operator/SubtractComponent";
import NumComponent from "./rete/components/NumComponent";
import TextComponent from "./rete/components/TextComponent";
import JsonComponent from "./rete/components/JsonComponent";
import TemplateComponent from "./rete/components/template/TemplateComponent";
import EJSComponent from "./rete/components/template/EJSComponent";
import HandlebarsComponent from "./rete/components/template/HandlebarsComponent";
import PugComponent from "./rete/components/template/PugComponent";
import IfComponent from "./rete/components/statement/IfComponent";
import BooleanComponent from "./rete/components/BooleanComponent";
import EndpointComponent from "./rete/components/EndpointComponent";
import PathComponent from "./rete/components/PathComponent";
import axios from "axios";
import { saveAs } from "file-saver";

export async function createEditor(container) {
  // 各種Socket定義
  // primitive
  const stringSocket = new Rete.Socket("String value");
  const booleanSocket = new Rete.Socket("Boolean value");

  const numSocket = new Rete.Socket("Number value");
  const textSocket = new Rete.Socket("Text value");
  // json
  const jsonSocket = new Rete.Socket("Json value");
  jsonSocket.combineWith(stringSocket);
  // template
  const templateSocket = new Rete.Socket("Template value");
  templateSocket.combineWith(stringSocket);
  const ejsSocket = new Rete.Socket("EJS value");
  ejsSocket.combineWith(templateSocket);
  const handlebarsSocket = new Rete.Socket("Handlebars value");
  handlebarsSocket.combineWith(templateSocket);
  const pugSocket = new Rete.Socket("Pug value");
  pugSocket.combineWith(templateSocket);
  // html
  const htmlSocket = new Rete.Socket("HTML value");
  htmlSocket.combineWith(stringSocket);
  const pathSocket = new Rete.Socket("Path value");

  // 利用可能なコンポーネント一覧
  const components = [
    new NumComponent(numSocket),
    new AddComponent(numSocket),
    new SubtractComponent(numSocket),
    new TextComponent(textSocket),
    new JsonComponent(jsonSocket),
    new TemplateComponent(jsonSocket, templateSocket, htmlSocket),
    new EJSComponent(ejsSocket),
    new HandlebarsComponent(handlebarsSocket),
    new PugComponent(pugSocket),
    new IfComponent(booleanSocket, stringSocket),
    new BooleanComponent(booleanSocket),
    new EndpointComponent(booleanSocket, stringSocket, pathSocket),
    new PathComponent(pathSocket)
  ];

  const editor = new Rete.NodeEditor("demo@0.1.0", container);
  editor.use(ConnectionPlugin);
  editor.use(ReactRenderPlugin);
  // ドラッグ・アンド・ドロップ可能なコンポーネントの一覧を.dockクラスに表示
  //   editor.use(DockPlugin, {
  //     container: document.querySelector(".dock"),
  //     itemClass: "dock-item", // default: dock-item
  //     plugins: [ReactRenderPlugin], // render plugins
  //   });
  // Nodeのサブメニュー（削除・複製機能）を追加
  // 及びNode外を右クリックでコンテキストメニューを表示
  editor.use(ContextMenuPlugin, {
    searchBar: false,
    delay: 100,
    allocate(component) {
      return component.path;
    },
    rename(component) {
      return component.name;
    },
    items: {
      Arrange() {
        editor.nodes.forEach((node) => {
          editor.trigger("arrange", node);
        });
      },
      Undo() {
        editor.trigger("undo");
      },
      Redo() {
        editor.trigger("redo");
      },
      Save() {
        axios.post("/regist", editor.toJSON()).then(function (response) {
          console.log(response.data);
        });
      },
      Download() {
        var blob = new Blob([JSON.stringify(editor.toJSON())], {
          type: "application/json;charset=utf-8",
        });
        saveAs(blob, "tuna-mayonnaise.json");
      },
      Debug() {
        console.log(JSON.stringify(editor.toJSON()));
      },
    },
  });
  // DeleteキーでNodeを削除・Spaceキーでコンテキストメニューを表示
  editor.use(KeyboardPlugin);
  // Shift + c および Shift + f でコメント追加
  editor.use(CommentPlugin, {
    margin: 20, // default indent for new frames is 30px
  });
  // 右下にミニマップを表示
  editor.use(MinimapPlugin);
  // コネクションパスの見た目を変更（矢印有表記へ）
  editor.use(ConnectionPathPlugin, {
    type: ConnectionPathPlugin.DEFAULT, // DEFAULT or LINEAR transformer
    transformer: () => ([x1, y1, x2, y2]) => [
      [x1, y1],
      [x2, y2],
    ], // optional, custom transformer
    curve: ConnectionPathPlugin.curveBundle, // curve id
    options: { vertical: false, curvature: 0.4 }, // optional
    arrow: { color: "steelblue", marker: "M-5,-10 L-5,10 L20,0 z" },
  });
  // コネクションパスの見た目を変更（直線ではなく曲線で各Node間を結ぶ）
  editor.use(ConnectionReroutePlugin);
  editor.use(AutoArrangePlugin, { margin: { x: 200, y: 100 }, depth: 0 });
  // Crtl + z, Ctrl + yで戻る、進む
  editor.use(HistoryPlugin, { keyboard: true });
  // デフォルトではMac標準（Command + z, Command + Shift + z）に対応していないので別途実装
  const ua = window.navigator.userAgent.toLowerCase();
  if (ua.indexOf("mac os x") !== -1) {
    document.addEventListener("keydown", (e) => {
      if (!e.metaKey) return;
      switch (e.code) {
        case "KeyY":
          editor.trigger("redo");
          break;
        case "KeyZ":
          if (e.shiftKey) {
            editor.trigger("redo");
          } else {
            editor.trigger("undo");
          }
          break;
      }
    });
  }

  const engine = new Rete.Engine("demo@0.1.0");

  components.map((c) => {
    editor.register(c);
    engine.register(c);
  });

  // 初期表示設定
  // const n1 = await components[0].createNode({ num: 2 });
  // const n2 = await components[0].createNode({ num: 3 });
  // const add = await components[1].createNode();
  // const subtract = await components[2].createNode();
  const endpoint = await components[11].createNode();

  // n1.position = [80, 200];
  // n2.position = [80, 400];
  // add.position = [500, 240];
  // subtract.position = [500, 480];
  endpoint.position = [1000, 200];

  // editor.addNode(n1);
  // editor.addNode(n2);
  // editor.addNode(add);
  // editor.addNode(subtract);
  editor.addNode(endpoint);

  // editor.connect(n1.outputs.get("num"), add.inputs.get("num1"));
  // editor.connect(n2.outputs.get("num"), add.inputs.get("num2"));

  // editor.connect(n2.outputs.get("num"), subtract.inputs.get("num2"));
  // editor.connect(n2.outputs.get("num"), subtract.inputs.get("num2"));

  editor.on(
    "process nodecreated noderemoved connectioncreated connectionremoved",
    async () => {
      console.log("process");
      await engine.abort();
      await engine.process(editor.toJSON());
    }
  );

  editor.view.resize();
  editor.trigger("process");
  AreaPlugin.zoomAt(editor, editor.nodes);
}
