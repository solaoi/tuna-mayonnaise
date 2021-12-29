# ![tuna-mayonnaise](https://user-images.githubusercontent.com/46414076/107111813-4b248600-6896-11eb-885d-592b90af0b09.png)

![license](https://img.shields.io/github/license/solaoi/tuna-mayonnaise)
![CodeQL](https://github.com/solaoi/tuna-mayonnaise/workflows/CodeQL/badge.svg)
[![go deps scan](https://github.com/solaoi/tuna-mayonnaise/actions/workflows/go-deps-scan.yml/badge.svg)](https://github.com/solaoi/tuna-mayonnaise/actions/workflows/go-deps-scan.yml)
[![nodejs deps scan](https://github.com/solaoi/tuna-mayonnaise/actions/workflows/nodejs-deps-scan.yml/badge.svg)](https://github.com/solaoi/tuna-mayonnaise/actions/workflows/nodejs-deps-scan.yml)

*他の言語で読む：[English](README.md)、[日本語](README.ja.md)*

TUNA-Mayonnaise（ツナマヨ）は、ノードベースエディタ上でJSONやHTMLを作成し、APIとして提供するコマンドラインツールです。

## 目次

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>CLICK</summary>

- [これなに](#%E3%81%93%E3%82%8C%E3%81%AA%E3%81%AB)
- [始め方](#%E5%A7%8B%E3%82%81%E6%96%B9)
  - [インストール方法](#%E3%82%A4%E3%83%B3%E3%82%B9%E3%83%88%E3%83%BC%E3%83%AB%E6%96%B9%E6%B3%95)
  - [使い方](#%E4%BD%BF%E3%81%84%E6%96%B9)
- [ツールの機能](#%E3%83%84%E3%83%BC%E3%83%AB%E3%81%AE%E6%A9%9F%E8%83%BD)
  - [テンプレートエンジン](#%E3%83%86%E3%83%B3%E3%83%97%E3%83%AC%E3%83%BC%E3%83%88%E3%82%A8%E3%83%B3%E3%82%B8%E3%83%B3)
  - [API](#api)
  - [データベース](#%E3%83%87%E3%83%BC%E3%82%BF%E3%83%99%E3%83%BC%E3%82%B9)
- [APIの機能](#api%E3%81%AE%E6%A9%9F%E8%83%BD)
  - [監視](#%E7%9B%A3%E8%A6%96)
- [活用例](#%E6%B4%BB%E7%94%A8%E4%BE%8B)
  - [1. 静的なJSONを返すサーバー作成](#1-%E9%9D%99%E7%9A%84%E3%81%AAjson%E3%82%92%E8%BF%94%E3%81%99%E3%82%B5%E3%83%BC%E3%83%90%E3%83%BC%E4%BD%9C%E6%88%90)
  - [2. 静的なHTMLを返すサーバー作成](#2-%E9%9D%99%E7%9A%84%E3%81%AAhtml%E3%82%92%E8%BF%94%E3%81%99%E3%82%B5%E3%83%BC%E3%83%90%E3%83%BC%E4%BD%9C%E6%88%90)
  - [3. 外部APIからのレスポンスを元に、動的なJSONを返すサーバー作成](#3-%E5%A4%96%E9%83%A8api%E3%81%8B%E3%82%89%E3%81%AE%E3%83%AC%E3%82%B9%E3%83%9D%E3%83%B3%E3%82%B9%E3%82%92%E5%85%83%E3%81%AB%E5%8B%95%E7%9A%84%E3%81%AAjson%E3%82%92%E8%BF%94%E3%81%99%E3%82%B5%E3%83%BC%E3%83%90%E3%83%BC%E4%BD%9C%E6%88%90)
  - [4. 外部APIからのレスポンスを元に、動的なHTMLを返すサーバー作成](#4-%E5%A4%96%E9%83%A8api%E3%81%8B%E3%82%89%E3%81%AE%E3%83%AC%E3%82%B9%E3%83%9D%E3%83%B3%E3%82%B9%E3%82%92%E5%85%83%E3%81%AB%E5%8B%95%E7%9A%84%E3%81%AAhtml%E3%82%92%E8%BF%94%E3%81%99%E3%82%B5%E3%83%BC%E3%83%90%E3%83%BC%E4%BD%9C%E6%88%90)
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
VERSION=v0.0.8
## 利用OSを指定してください。
OS=linux_amd64
## wget経由の場合
wget https://github.com/solaoi/tuna-mayonnaise/releases/download/$VERSION/tuna_${OS}.tar.gz
## curl経由の場合
curl -LO  https://github.com/solaoi/tuna-mayonnaise/releases/download/$VERSION/tuna_${OS}.tar.gz
## 解凍
tar xvf ./tuna_${OS}.tar.gz
## /usr/local/binなどのPATHの通った場所に移動してください。
mv ./tuna /usr/local/bin/

# アップデート
tuna update
```

### 使い方

#### 1. ツールをブラウザで開く

`tuna tool` コマンドを実行すると、下記のようにブラウザが起動します。

このUI上で、 `Save` メニューから設定ファイル（ `tuna-mayonnaise.json` ）を作成できます。

![tuna-demo](https://user-images.githubusercontent.com/46414076/128729100-5f37d74d-3df8-4f4b-acac-81334b52dd3d.gif)

[UI サンプル](https://solaoi.github.io/tuna-mayonnaise)

※ このサンプルは `Save` メニューをサポートしてませんが、 `Download` メニューから編集した設定を取得できます。 

#### 2. 作成したJSONや、HTMLをAPIとして提供する

`tuna api` コマンドを実行すると、 `http://localhost:8080` でJSONや、HTMLをAPIとして提供します。

このコマンドは、実行ディレクトリ内の設定ファイル（ `tuna-mayonnaise.json` ）を参照します。

## ツールの機能

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

## APIの機能

### 監視

1. TUNA-Mayonnaise（ツナマヨ）は、Prometheusのメトリクスを `/metrics` で提供します。   
メトリクスは、２つの統計情報を含みます。

- Echoライブラリ標準のPrometheusのメトリクス
- TUNA-Mayonnaise（ツナマヨ）で提供されるAPIコンポーネントのステータスコード、メソッド、URL

2. TUNA-Mayonnaise（ツナマヨ）は、ヘルスチェックを `/health` で提供します。
3. TUNA-Mayonnaise（ツナマヨ）は、Labeled Tab-separated Values ( `LTSV` ) フォーマット形式でログ出力します。

## 活用例

### 1. 静的なJSONを返すサーバー作成

詳しくは[こちら](samples/serve-static-json/README.ja.md)

### 2. 静的なHTMLを返すサーバー作成

詳しくは[こちら](samples/serve-static-html/README.ja.md)

### 3. 外部APIからのレスポンスを元に、動的なJSONを返すサーバー作成

詳しくは[こちら](samples/serve-dynamic-json/README.ja.md)

### 4. 外部APIからのレスポンスを元に、動的なHTMLを返すサーバー作成

詳しくは[こちら](samples/serve-dynamic-html/README.ja.md)

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
 | [github.com/kpango/gache](https://github.com/kpango/gache) | MIT License |
 | [github.com/labstack/echo](https://github.com/labstack/echo) | MIT License |
 | [github.com/labstack/echo-contrib](https://github.com/labstack/echo-contrib) | MIT License |
 | [github.com/lib/pq](https://github.com/lib/pq) | MIT License |
 | [github.com/mohae/deepcopy](https://github.com/mohae/deepcopy) | MIT License |
 | [github.com/prometheus/client_golang](https://github.com/prometheus/client_golang) | Apache License 2.0 |
 | [github.com/rhysd/go-github-selfupdate](https://github.com/rhysd/go-github-selfupdate) | MIT License |
 | [github.com/rodaine/table](https://github.com/rodaine/table) | MIT License |
 | [github.com/spf13/cobra](https://github.com/spf13/cobra) | Apache License 2.0 |

### フロントエンドの依存関係

 | ライブラリ  | ライセンス |
 | :------------- | :------------- |
 | [axios](https://www.npmjs.com/package/axios) | MIT License |
 | [file-saver](https://www.npmjs.com/package/file-saver) | MIT License |
 | [handlebars](https://www.npmjs.com/package/handlebars) | MIT License |
 | [js-sql-parser](https://github.com/JavaScriptor/js-sql-parser) | MIT License |
 | [jsonlint-mod](https://github.com/circlecell/jsonlint-mod) | MIT License |
 | [prismjs](https://www.npmjs.com/package/prismjs) | MIT License |
 | [pug](https://www.npmjs.com/package/pug) | MIT License |
 | [react](https://www.npmjs.com/package/react) | MIT License |
 | [react-dom](https://www.npmjs.com/package/react-dom) | MIT License |
 | [react-modal](https://www.npmjs.com/package/react-modal) | MIT License |
 | [react-simple-code-editor](https://www.npmjs.com/package/react-simple-code-editor) | MIT License |
 | [react-toastify](https://www.npmjs.com/package/react-toastify) | MIT License |
 | [react-use](https://www.npmjs.com/package/react-use) | Unlicense License |
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

### フロントエンド（開発用）の依存関係

 | ライブラリ  | ライセンス |
 | :------------- | :------------- |
 | [@babel/eslint-parser](https://www.npmjs.com/package/@babel/eslint-parser) | MIT License |
 | [customize-cra](https://www.npmjs.com/package/customize-cra) | MIT License |
 | [customize-cra-eslint](https://www.npmjs.com/package/customize-cra-eslint) | MIT License |
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
 | [react-app-rewired](https://www.npmjs.com/package/react-app-rewired) | MIT License |
 | [react-scripts](https://www.npmjs.com/package/react-scripts) | MIT License |
 | [stylelint](https://www.npmjs.com/package/stylelint) | MIT License |
 | [stylelint-config-prettier](https://www.npmjs.com/package/stylelint-config-prettier) | MIT License |
 | [stylelint-config-recommended](https://www.npmjs.com/package/stylelint-config-recommended) | MIT License |
 | [stylelint-order](https://www.npmjs.com/package/stylelint-order) | MIT License |
 | [stylelint-prettier](https://www.npmjs.com/package/stylelint-prettier) | MIT License |
