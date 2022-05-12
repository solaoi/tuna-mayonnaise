// eslint-disable-next-line no-unused-vars
import React from "react";
import Rete from "rete";
import ReactRenderPlugin from "rete-react-render-plugin";
import ConnectionPlugin from "rete-connection-plugin";
import AreaPlugin from "rete-area-plugin";
import ContextMenuPlugin from "rete-context-menu-plugin";
import MinimapPlugin from "rete-minimap-plugin";
import ConnectionPathPlugin from "rete-connection-path-plugin";
import ConnectionReroutePlugin from "rete-connection-reroute-plugin";
import AutoArrangePlugin from "rete-auto-arrange-plugin";
import HistoryPlugin from "rete-history-plugin";

import { JsonComponent } from "./rete/components/input/JsonComponent";
import { DummyJsonComponent } from "./rete/components/input/DummyJsonComponent";
import { UrlComponent } from "./rete/components/input/UrlComponent";
import { UrlWithPathParamComponent } from "./rete/components/input/UrlWithPathParamComponent";
import { HtmlComponent } from "./rete/components/input/HtmlComponent";
import { SqlComponent } from "./rete/components/input/SqlComponent";
import { SqlWithPlaceHolderComponent } from "./rete/components/input/SqlWithPlaceHolderComponent";
import { TemplateComponent } from "./rete/components/template/TemplateComponent";
import { HandlebarsComponent } from "./rete/components/template/HandlebarsComponent";
import { PugComponent } from "./rete/components/template/PugComponent";
import { EndpointComponent } from "./rete/components/EndpointComponent";
import { EndpointWithErrorComponent } from "./rete/components/EndpointWithErrorComponent";
import { JsonManagerComponent } from "./rete/components/JsonManagerComponent";
import { ApiComponent } from "./rete/components/ApiComponent";
import { MySQLComponent } from "./rete/components/MySQLComponent";
import { PostgreSQLComponent } from "./rete/components/PostgreSQLComponent";
import { SQLiteComponent } from "./rete/components/SQLiteComponent";
import { RequestComponent } from "./rete/components/RequestComponent";
import { RedirectEndpointComponent } from "./rete/components/RedirectEndpointComponent";

export async function createEditor(container) {
  // 各種Socket定義
  // primitive
  const stringSocket = new Rete.Socket("String value");
  const errorSocket = new Rete.Socket("Error value");
  // json
  const jsonSocket = new Rete.Socket("Json value");
  jsonSocket.combineWith(stringSocket);
  const rawJsonSocket = new Rete.Socket("raw Json value");
  rawJsonSocket.combineWith(errorSocket);
  rawJsonSocket.combineWith(jsonSocket);
  rawJsonSocket.combineWith(stringSocket);
  // dummyJson
  const dummyJsonSocket = new Rete.Socket("DummyJson value");
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
  const rawHtmlSocket = new Rete.Socket("HTML Json value");
  rawHtmlSocket.combineWith(errorSocket);
  rawHtmlSocket.combineWith(htmlSocket);
  rawHtmlSocket.combineWith(stringSocket);
  // sql
  const sqlSocket = new Rete.Socket("SQL value");
  // url
  const urlSocket = new Rete.Socket("URL value");

  // 利用可能なコンポーネント一覧
  const components = [
    new EndpointComponent(stringSocket),
    new EndpointWithErrorComponent(stringSocket, errorSocket),
    new JsonManagerComponent(jsonSocket),
    new JsonComponent(rawJsonSocket),
    new DummyJsonComponent(dummyJsonSocket),
    new UrlComponent(urlSocket),
    new UrlWithPathParamComponent(urlSocket, jsonSocket),
    new HtmlComponent(rawHtmlSocket),
    new TemplateComponent(jsonSocket, templateSocket, htmlSocket),
    new HandlebarsComponent(handlebarsSocket),
    new PugComponent(pugSocket),
    new SqlComponent(sqlSocket),
    new SqlWithPlaceHolderComponent(sqlSocket, jsonSocket),
    new ApiComponent(jsonSocket, dummyJsonSocket, urlSocket),
    new MySQLComponent(jsonSocket, dummyJsonSocket, sqlSocket),
    new PostgreSQLComponent(jsonSocket, dummyJsonSocket, sqlSocket),
    new SQLiteComponent(jsonSocket, dummyJsonSocket, sqlSocket),
    new RequestComponent(jsonSocket, dummyJsonSocket),
    new RedirectEndpointComponent(),
  ];

  const ua = window.navigator.userAgent.toLowerCase();
  const isMacOS = ua.indexOf("mac os x") !== -1;
  const isInputFocused = () => {
    const { nodeName } = document.activeElement;
    return nodeName === "TEXTAREA" || nodeName === "INPUT";
  };
  const editor = new Rete.NodeEditor("tuna-mayonnaise@0.0.1", container);
  editor.use(ConnectionPlugin);
  editor.use(ReactRenderPlugin);
  // Nodeのサブメニュー（削除・複製機能）を追加
  // 及びNode外を右クリックでコンテキストメニューを表示
  const errorHandlerOnSave = () => {
    import("react-hot-toast").then((_) => _.toast.error("NOT CONNECTED :("));
  };
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
        fetch("/regist", {
          method: "POST",
          body: JSON.stringify(editor.toJSON()),
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((res) => {
            res.ok
              ? import("react-hot-toast").then((_) =>
                  _.toast.success("SAVED :)")
                )
              : errorHandlerOnSave();
          })
          .catch(() => errorHandlerOnSave());
      },
      Download() {
        const blob = new Blob([JSON.stringify(editor.toJSON())], {
          type: "application/json; charset=utf-8",
        });
        import("file-saver").then(({ saveAs }) =>
          saveAs(blob, "tuna-mayonnaise.json")
        );
      },
      Debug() {
        // eslint-disable-next-line no-console
        console.log(JSON.stringify(editor.toJSON()));
      },
    },
  });
  // ダブルクリックおよび入力エリアでのズームを無効化
  editor.on(
    "zoom",
    ({ source }) =>
      source !== "dblclick" && source === "wheel" && !isInputFocused()
  );
  // 履歴機能を追加
  editor.use(HistoryPlugin, { keyboard: false });
  // ショートカットキー設定
  editor.on("keydown", (e) => {
    // テキスト入力時はキー無効
    if (isInputFocused()) return;
    switch (e.code) {
      // DeleteキーでNodeを削除
      case "Delete":
      case "Backspace":
        editor.selected.each((n) => {
          editor.removeNode(n);
        });
        editor.selected.clear();
        return;
      // Spaceキーでメニュー表示
      case "Space": {
        const rect = editor.view.container.getBoundingClientRect();
        const event = new PointerEvent("contextmenu", {
          clientX: rect.left + rect.width / 2,
          clientY: rect.top + rect.height / 2,
        });
        editor.trigger("contextmenu", { e: event, view: editor.view });
        return;
      }
      default:
        break;
    }

    // MacOSの場合は、Ctrlに加えCommandキーでの入力に対応
    if (e.ctrlKey || (isMacOS && e.metaKey)) {
      switch (e.code) {
        case "KeyY":
          editor.trigger("redo");
          return;
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
    }
  });
  // 右下にミニマップを表示
  editor.use(MinimapPlugin);
  // コネクションパスの見た目を変更（矢印有表記へ）
  editor.use(ConnectionPathPlugin, {
    type: ConnectionPathPlugin.DEFAULT, // DEFAULT or LINEAR transformer
    transformer:
      () =>
      ([x1, y1, x2, y2]) =>
        [
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

  const engine = new Rete.Engine("tuna-mayonnaise@0.0.1");

  components.forEach((c) => {
    editor.register(c);
    engine.register(c);
  });

  const errorHandlerOnGetConfig = () => {
    document.getElementsByClassName("rightClick")[0].style.display = "block";
    return null;
  };
  const data = await fetch("/tuna-configuration")
    .then((res) => (res.ok ? res.json() : errorHandlerOnGetConfig()))
    .catch(() => errorHandlerOnGetConfig());

  if (data !== null) {
    await editor.fromJSON(data);
    import("react-hot-toast").then((_) => _.toast.success("RESUMED :)"));
  } else {
    const endpoint = await components[0].createNode();
    endpoint.position = [1000, 200];
    editor.addNode(endpoint);
  }

  editor.on("showcontextmenu", () => {
    document.getElementsByClassName("rightClick")[0].style.display = "none";
    return true;
  });

  editor.on(
    "process nodecreated noderemoved connectioncreated connectionremoved",
    async () => {
      // テキスト入力欄のスクロールを有効化
      document.querySelectorAll(".editorTextarea").forEach((area) => {
        area.addEventListener("wheel", (e) => {
          if (isInputFocused()) {
            area.parentElement.parentElement.scrollTop += e.deltaY;
          }
        });
      });
      await engine.abort();
      await engine.process(editor.toJSON());
    }
  );

  editor.view.resize();
  editor.trigger("process");
  AreaPlugin.zoomAt(editor, editor.nodes);
}
