// eslint-disable-next-line no-unused-vars
import React from "react";
import Rete from "rete";
import ReactRenderPlugin from "rete-react-render-plugin";
import ConnectionPlugin from "rete-connection-plugin";
import AreaPlugin from "rete-area-plugin";
import ContextMenuPlugin from "rete-context-menu-plugin";
import KeyboardPlugin from "rete-keyboard-plugin";
import CommentPlugin from "rete-comment-plugin";
import MinimapPlugin from "rete-minimap-plugin";
import ConnectionPathPlugin from "rete-connection-path-plugin";
import ConnectionReroutePlugin from "rete-connection-reroute-plugin";
import AutoArrangePlugin from "rete-auto-arrange-plugin";
import HistoryPlugin from "rete-history-plugin";
import { toast } from "react-toastify";

import TextComponent from "./rete/components/input/TextComponent";
import JsonComponent from "./rete/components/input/JsonComponent";
import TemplateComponent from "./rete/components/template/TemplateComponent";
import HandlebarsComponent from "./rete/components/template/HandlebarsComponent";
import PugComponent from "./rete/components/template/PugComponent";
import BooleanComponent from "./rete/components/input/BooleanComponent";
import EndpointComponent from "./rete/components/EndpointComponent";
import PathComponent from "./rete/components/input/PathComponent";
import ApiComponent from "./rete/components/ApiComponent";
import UrlComponent from "./rete/components/input/UrlComponent";
import axios from "axios";
import { saveAs } from "file-saver";

export async function createEditor(container) {
  // 各種Socket定義
  // primitive
  const stringSocket = new Rete.Socket("String value");
  const booleanSocket = new Rete.Socket("Boolean value");

  // const numSocket = new Rete.Socket("Number value");
  const textSocket = new Rete.Socket("Text value");
  textSocket.combineWith(stringSocket);
  // json
  const jsonSocket = new Rete.Socket("Json value");
  jsonSocket.combineWith(stringSocket);
  // template
  const templateSocket = new Rete.Socket("Template value");
  templateSocket.combineWith(stringSocket);
  const handlebarsSocket = new Rete.Socket("Handlebars value");
  handlebarsSocket.combineWith(templateSocket);
  const pugSocket = new Rete.Socket("Pug value");
  pugSocket.combineWith(templateSocket);
  // html
  const htmlSocket = new Rete.Socket("HTML value");
  htmlSocket.combineWith(stringSocket);
  const pathSocket = new Rete.Socket("Path value");
  // api
  const urlSocket = new Rete.Socket("URL value");

  // 利用可能なコンポーネント一覧
  const components = [
    new EndpointComponent(stringSocket),
    new TextComponent(textSocket),
    new JsonComponent(jsonSocket),
    new TemplateComponent(jsonSocket, templateSocket, htmlSocket),
    new HandlebarsComponent(handlebarsSocket),
    new PugComponent(pugSocket),
    new BooleanComponent(booleanSocket),
    new PathComponent(pathSocket),
    new ApiComponent(urlSocket, jsonSocket),
    new UrlComponent(urlSocket),
  ];

  const editor = new Rete.NodeEditor("tuna-mayonnaise@0.0.1", container);
  editor.use(ConnectionPlugin);
  editor.use(ReactRenderPlugin);
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
        axios
          .post("/regist", editor.toJSON())
          .then(() => toast.success("This configuration is SAVED :)"))
          .catch(() => toast.error("Maybe tuna tool command is TERMINATED :("));
      },
      Download() {
        const blob = new Blob([JSON.stringify(editor.toJSON())], {
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
  editor.use(AutoArrangePlugin, { margin: { x: 200, y: 50 }, depth: 0 });
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
        default:
          break;
      }
    });
  }

  const engine = new Rete.Engine("tuna-mayonnaise@0.0.1");

  components.forEach((c) => {
    editor.register(c);
    engine.register(c);
  });

  const data = await axios
    .get("/tuna-configuration")
    .then((res) => res.data)
    .catch(() => {
      document.getElementsByClassName("rightClick")[0].style.display = "block";
      return null;
    });

  if (data !== null) {
    await editor.fromJSON(data);
    toast.success("Previous configuration is RESTORED :)")
  } else {
    const endpoint = await components[0].createNode();
    endpoint.position = [1000, 200];
    editor.addNode(endpoint);
  }

  editor.on('showcontextmenu', ({ e, node }) => {
    document.getElementsByClassName("rightClick")[0].style.display = "none";
    return true;
  });

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
