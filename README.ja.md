<div align="center">
  <a href="https://github.com/solaoi/tuna-mayonnaise">
    <img alt="tuna-mayonnaise" src="https://user-images.githubusercontent.com/46414076/107111813-4b248600-6896-11eb-885d-592b90af0b09.png">
  </a>
</div>

![license](https://img.shields.io/github/license/solaoi/tuna-mayonnaise)
![GitHub release (latest by date)](https://img.shields.io/github/v/release/solaoi/tuna-mayonnaise)
![CodeQL](https://github.com/solaoi/tuna-mayonnaise/workflows/CodeQL/badge.svg)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/9fe6fc4098164d938804cf1e011c6b3a)](https://app.codacy.com/gh/solaoi/tuna-mayonnaise?utm_source=github.com&utm_medium=referral&utm_content=solaoi/tuna-mayonnaise&utm_campaign=Badge_Grade_Settings)
![GitHub go.mod Go version (subdirectory of monorepo)](https://img.shields.io/github/go-mod/go-version/solaoi/tuna-mayonnaise?filename=command%2Fgo.mod)
[![go deps scan](https://github.com/solaoi/tuna-mayonnaise/actions/workflows/go-deps-scan.yml/badge.svg)](https://github.com/solaoi/tuna-mayonnaise/actions/workflows/go-deps-scan.yml)
[![nodejs deps scan](https://github.com/solaoi/tuna-mayonnaise/actions/workflows/nodejs-deps-scan.yml/badge.svg)](https://github.com/solaoi/tuna-mayonnaise/actions/workflows/nodejs-deps-scan.yml)
[![Open in Visual Studio Code](https://img.shields.io/static/v1?logo=visualstudiocode&label=&message=Open%20in%20Visual%20Studio%20Code&labelColor=2c2c32&color=007acc&logoColor=007acc)](https://open.vscode.dev/solaoi/tuna-mayonnaise)

*他の言語で読む：[English](README.md)、[日本語](README.ja.md)*

<h2 align="center">
ツナマヨは、ノードベースエディタ上でJSONやHTMLを作成し、APIとして提供します。
</h2>

<div align="center">
  <a href="https://github.com/solaoi/tuna-mayonnaise">
    <img alt="tuna-mayonnaise-demo" src="https://user-images.githubusercontent.com/46414076/168936743-9af035eb-2cdd-42c8-9d5c-d2fdc2a70f01.gif">
  </a>
</div>

## 目次

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>CLICK</summary>

- [これなに](#%E3%81%93%E3%82%8C%E3%81%AA%E3%81%AB)
- [始め方](#%E5%A7%8B%E3%82%81%E6%96%B9)
  - [インストール方法](#%E3%82%A4%E3%83%B3%E3%82%B9%E3%83%88%E3%83%BC%E3%83%AB%E6%96%B9%E6%B3%95)
  - [使い方](#%E4%BD%BF%E3%81%84%E6%96%B9)
- [機能一覧](#%E6%A9%9F%E8%83%BD%E4%B8%80%E8%A6%A7)
  - [テンプレートエンジン](#%E3%83%86%E3%83%B3%E3%83%97%E3%83%AC%E3%83%BC%E3%83%88%E3%82%A8%E3%83%B3%E3%82%B8%E3%83%B3)
  - [API](#api)
  - [データベース](#%E3%83%87%E3%83%BC%E3%82%BF%E3%83%99%E3%83%BC%E3%82%B9)
  - [監視](#%E7%9B%A3%E8%A6%96)
- [依存関係](#%E4%BE%9D%E5%AD%98%E9%96%A2%E4%BF%82)
  - [バックエンドの依存関係](#%E3%83%90%E3%83%83%E3%82%AF%E3%82%A8%E3%83%B3%E3%83%89%E3%81%AE%E4%BE%9D%E5%AD%98%E9%96%A2%E4%BF%82)
  - [フロントエンドの依存関係](#%E3%83%95%E3%83%AD%E3%83%B3%E3%83%88%E3%82%A8%E3%83%B3%E3%83%89%E3%81%AE%E4%BE%9D%E5%AD%98%E9%96%A2%E4%BF%82)
  - [フロントエンド（開発用）の依存関係](#%E3%83%95%E3%83%AD%E3%83%B3%E3%83%88%E3%82%A8%E3%83%B3%E3%83%89%E9%96%8B%E7%99%BA%E7%94%A8%E3%81%AE%E4%BE%9D%E5%AD%98%E9%96%A2%E4%BF%82)

</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## これなに

世の中には多くのWEBフレームワークがあり、貴方はそのどれか一つ、またはいくつかを使ってWEB開発をしているはずです。   
そのいずれのフレームワークであっても、貴方は多くの記述パターンを発見し、同じ処理を書くことに飽き飽きしていることでしょう。

そこで、パターンは全て設定ファイルに書いてしまいたい！と思った貴方は、極めて優秀なエンジニアです。   
ただYAMLにせよJSONにせよ、昨今のWEB開発の記述パターンを表現するには少し力不足です。   

であれば、ビジュアルプログラミングのUI上で、各設定を線と線で結び表現してはどうでしょうか。
そんな試みから生まれたのが、このおにぎりの具として最も有名なTUNA-Mayonnaise（ツナマヨ）です。

## 始め方

### インストール方法

#### MacOSの場合 (Homebrew)

```sh
# インストール
brew install solaoi/tap/tuna
# アップデート
brew upgrade tuna
```

#### その他OSの場合 (実行ファイルを直接ダウンロード)

[こちらから](https://github.com/solaoi/tuna-mayonnaise/releases) 各OSごとの実行ファイルをダウンロードできます。

```sh
# wget または curl でインストール
## releasesタブの最新のバージョンを指定してください。
VERSION=v0.0.29
## 利用OSを指定してください。
OS=linux_amd64
## wget経由の場合
wget https://github.com/solaoi/tuna-mayonnaise/releases/download/$VERSION/tuna_${OS}.tar.gz
## curl経由の場合
curl -LO  https://github.com/solaoi/tuna-mayonnaise/releases/download/$VERSION/tuna_${OS}.tar.gz
## 解凍
tar xvf ./tuna_${OS}_amd64.tar.gz
## /usr/local/binなどのPATHの通った場所に移動してください。
mv ./tuna /usr/local/bin/

# アップデート
tuna update
```

### 使い方

#### 1. ツールをブラウザで開く

`tuna tool` コマンドを実行すると、下記のようにブラウザが起動します。

このUI上で、 `Save` メニューから設定ファイル（ `tuna-mayonnaise.json` ）を作成できます。

[UI サンプル](https://solaoi.github.io/tuna-mayonnaise)

※ このサンプルは `Save` メニューをサポートしてませんが、 `Download` メニューから編集した設定を取得できます。 

#### 2. 作成したJSONや、HTMLをAPIとして提供する

`tuna api` コマンドを実行すると、 `http://localhost:8080` でJSONや、HTMLをAPIとして提供します。

このコマンドは、実行ディレクトリ内の設定ファイル（ `tuna-mayonnaise.json` ）を参照します。

## 機能一覧

### テンプレートエンジン

HTMLを作成する際に、テンプレートエンジンとして下記を利用できます。

- Pug
- Handlebars

### API

WEB APIにリクエストし、そのレスポンスを利用できます。

### データベース

このツールは下記データベースをサポートしてます。

- MySQL
- PostgreSQL
- SQLite3

データは、JSON形式で利用できます。

例）

仮に下記テーブルがあった場合、

 | id  | name |
 | :------------- | :------------- |
 | 1 | foo |
 | 2 | bar |

次のようなレスポンスを取得できます。

```json
[
  {"id":1, "name":"foo"},
  {"id":2, "name":"bar"}
]
```

#### 接続オプション

##### TLS / SSL

- MySQL: [tls](https://github.com/go-sql-driver/mysql#tls)
- PostgreSQL: [sslmode](https://pkg.go.dev/github.com/lib/pq#hdr-Connection_String_Parameters)

### 監視

1. TUNA-Mayonnaise（ツナマヨ）は、Prometheusのメトリクスを `/metrics` で提供します。   
メトリクスは、２つの統計情報を含みます。

- Echoライブラリ標準のPrometheusのメトリクス
- TUNA-Mayonnaise（ツナマヨ）で提供されるAPIコンポーネントのステータスコード、メソッド、URL

2. TUNA-Mayonnaise（ツナマヨ）は、ヘルスチェックを `/health` で提供します。
3. TUNA-Mayonnaise（ツナマヨ）は、Labeled Tab-separated Values ( `LTSV` ) フォーマット形式でログ出力します。

## 依存関係

TUNA-Mayonnaise（ツナマヨ）は、多くのOSSによって成り立ってます。

### バックエンドの依存関係

 | ライブラリ  | ライセンス |
 | :------------- | :------------- |
 | [github.com/aymerick/raymond](https://github.com/aymerick/raymond) | MIT License |
 | [github.com/blang/semver](https://github.com/blang/semver) | MIT License |
 | [github.com/christopherhein/go-version](https://github.com/christopherhein/go-version) | Apache License 2.0 |
 | [github.com/common-nighthawk/go-figure](https://github.com/common-nighthawk/go-figure) | MIT License |
 | [github.com/eknkc/pug](https://github.com/eknkc/pug) | MIT License |
 | [github.com/fatih/color](https://github.com/fatih/color) | MIT License |
 | [github.com/go-sql-driver/mysql](https://github.com/go-sql-driver/mysql) | MPL-2.0 License |
 | [github.com/iancoleman/orderedmap](https://github.com/iancoleman/orderedmap) | MIT License |
 | [github.com/kpango/gache](https://github.com/kpango/gache) | MIT License |
 | [github.com/labstack/echo](https://github.com/labstack/echo) | MIT License |
 | [github.com/labstack/echo-contrib](https://github.com/labstack/echo-contrib) | MIT License |
 | [github.com/lib/pq](https://github.com/lib/pq) | MIT License |
 | [github.com/mattn/go-sqlite3](https://github.com/mattn/go-sqlite3) | MIT License |
 | [github.com/mohae/deepcopy](https://github.com/mohae/deepcopy) | MIT License |
 | [github.com/prometheus/client_golang](https://github.com/prometheus/client_golang) | Apache License 2.0 |
 | [github.com/rhysd/go-github-selfupdate](https://github.com/rhysd/go-github-selfupdate) | MIT License |
 | [github.com/rodaine/table](https://github.com/rodaine/table) | MIT License |
 | [github.com/spf13/cobra](https://github.com/spf13/cobra) | Apache License 2.0 |

### フロントエンドの依存関係

 | ライブラリ  | ライセンス |
 | :------------- | :------------- |
 | [@monaco-editor/react](https://www.npmjs.com/package/@monaco-editor/react) | MIT License |
 | [file-saver](https://www.npmjs.com/package/file-saver) | MIT License |
 | [handlebars](https://www.npmjs.com/package/handlebars) | MIT License |
 | [js-sql-parser](https://github.com/JavaScriptor/js-sql-parser) | MIT License |
 | [pug](https://www.npmjs.com/package/pug) | MIT License |
 | [react](https://www.npmjs.com/package/react) | MIT License |
 | [react-dom](https://www.npmjs.com/package/react-dom) | MIT License |
 | [react-modal](https://www.npmjs.com/package/react-modal) | MIT License |
 | [react-hot-toast](https://www.npmjs.com/package/react-hot-toast) | MIT License |
 | [regenerator-runtime](https://www.npmjs.com/package/regenerator-runtime) | MIT License |
 | [rete](https://www.npmjs.com/package/rete) | MIT License |
 | [rete-area-plugin](https://www.npmjs.com/package/rete-area-plugin) | ISC |
 | [rete-auto-arrange-plugin](https://www.npmjs.com/package/rete-auto-arrange-plugin) | MIT License |
 | [rete-connection-path-plugin](https://www.npmjs.com/package/rete-connection-path-plugin) | MIT License |
 | [rete-connection-plugin](https://www.npmjs.com/package/rete-connection-plugin) | MIT License |
 | [rete-connection-reroute-plugin](https://www.npmjs.com/package/rete-connection-reroute-plugin) | MIT License |
 | [rete-context-menu-plugin](https://www.npmjs.com/package/rete-context-menu-plugin) | MIT License |
 | [rete-history-plugin](https://www.npmjs.com/package/rete-history-plugin) | MIT License |
 | [rete-minimap-plugin](https://www.npmjs.com/package/rete-minimap-plugin) | MIT License |
 | [rete-react-render-plugin](https://www.npmjs.com/package/rete-react-render-plugin) | ISC |
 | [use-interval](https://www.npmjs.com/package/use-interval) | MIT License |

### フロントエンド（開発用）の依存関係

 | ライブラリ  | ライセンス |
 | :------------- | :------------- |
 | [@types/pug](https://www.npmjs.com/package/@types/pug) | MIT License |
 | [@types/react](https://www.npmjs.com/package/@types/react) | MIT License |
 | [@types/react-dom](https://www.npmjs.com/package/@types/react-dom) | MIT License |
 | [@types/react-modal](https://www.npmjs.com/package/@types/react-modal) | MIT License |
 | [@vitejs/plugin-react](https://www.npmjs.com/package/@vitejs/plugin-react) | MIT License |
 | [eslint](https://www.npmjs.com/package/eslint) | MIT License |
 | [eslint-config-airbnb](https://www.npmjs.com/package/eslint-config-airbnb) | MIT License |
 | [eslint-config-prettier](https://www.npmjs.com/package/eslint-config-prettier) | MIT License |
 | [eslint-plugin-import](https://www.npmjs.com/package/eslint-plugin-import) | MIT License |
 | [eslint-plugin-jsx-a11y](https://www.npmjs.com/package/eslint-plugin-jsx-a11y) | MIT License |
 | [eslint-plugin-react](https://www.npmjs.com/package/eslint-plugin-react) | MIT License |
 | [eslint-plugin-react-hooks](https://www.npmjs.com/package/eslint-plugin-react-hooks) | MIT License |
 | [husky](https://www.npmjs.com/package/husky) | MIT License |
 | [lint-staged](https://www.npmjs.com/package/lint-staged) | MIT License |
 | [prettier](https://www.npmjs.com/package/prettier) | MIT License |
 | [rollup-plugin-visualizer](https://www.npmjs.com/package/rollup-plugin-visualizer) | MIT License |
 | [stylelint](https://www.npmjs.com/package/stylelint) | MIT License |
 | [stylelint-config-prettier](https://www.npmjs.com/package/stylelint-config-prettier) | MIT License |
 | [stylelint-config-recommended](https://www.npmjs.com/package/stylelint-config-recommended) | MIT License |
 | [stylelint-order](https://www.npmjs.com/package/stylelint-order) | MIT License |
 | [stylelint-prettier](https://www.npmjs.com/package/stylelint-prettier) | MIT License |
 | [typescript](https://www.npmjs.com/package/typescript) | Apache License 2.0 |
 | [vite](https://www.npmjs.com/package/vite) | MIT License |
 | [vite-plugin-externals](https://www.npmjs.com/package/vite-plugin-externals) | MIT License |
