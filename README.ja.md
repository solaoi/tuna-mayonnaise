# ![tuna-mayonnaise](https://user-images.githubusercontent.com/46414076/107111813-4b248600-6896-11eb-885d-592b90af0b09.png)

![license](https://img.shields.io/github/license/solaoi/tuna-mayonnaise)
![CodeQL](https://github.com/solaoi/tuna-mayonnaise/workflows/CodeQL/badge.svg)

*他の言語で読む：[English](README.md)、[日本語](README.ja.md)*

TUNA-Mayonnaise（ツナマヨ）は、ビジュアルプログラミング環境でJSONやHTMLを作成・API提供するコマンドラインツールです。

## 目次

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>CLICK</summary>

- [API提供の特徴](#api%E6%8F%90%E4%BE%9B%E3%81%AE%E7%89%B9%E5%BE%B4)
  - [監視](#%E7%9B%A3%E8%A6%96)
- [インストール方法](#%E3%82%A4%E3%83%B3%E3%82%B9%E3%83%88%E3%83%BC%E3%83%AB%E6%96%B9%E6%B3%95)
  - [実行ファイルを直接ダウンロード](#%E5%AE%9F%E8%A1%8C%E3%83%95%E3%82%A1%E3%82%A4%E3%83%AB%E3%82%92%E7%9B%B4%E6%8E%A5%E3%83%80%E3%82%A6%E3%83%B3%E3%83%AD%E3%83%BC%E3%83%89)
  - [Homebrewを利用](#homebrew%E3%82%92%E5%88%A9%E7%94%A8)
- [使い方](#%E4%BD%BF%E3%81%84%E6%96%B9)
  - [1. 設定ファイルを作成](#1-%E8%A8%AD%E5%AE%9A%E3%83%95%E3%82%A1%E3%82%A4%E3%83%AB%E3%82%92%E4%BD%9C%E6%88%90)
  - [2. 設定ファイルを利用](#2-%E8%A8%AD%E5%AE%9A%E3%83%95%E3%82%A1%E3%82%A4%E3%83%AB%E3%82%92%E5%88%A9%E7%94%A8)
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

## API提供の特徴

### 監視

1. TUNA-Mayonnaise（ツナマヨ）は、Prometheusのメトリクスを `/metrics` で提供します。

メトリクスは、２つの統計情報を含みます。

- Echoライブラリ標準のPrometheusのメトリクス
- TUNA-Mayonnaise（ツナマヨ）で提供されるAPIコンポーネントのステータスコード、メソッド、URL

2. TUNA-Mayonnaise（ツナマヨ）は、ヘルスチェックを `/health` で提供します。
3. TUNA-Mayonnaise（ツナマヨ）は、Labeled Tab-separated Values ( `LTSV` ) フォーマット形式でログ出力します。

## インストール方法

### 実行ファイルを直接ダウンロード

[こちらから](https://github.com/solaoi/tuna-mayonnaise/releases) 各OSごとの実行ファイルをダウンロードできます。

### Homebrewを利用

```
brew install solaoi/tap/tuna
```

## 使い方

### 1. 設定ファイルを作成

`tuna tool` コマンドを実行すると、下記のようにブラウザが起動します。

このUI上で、 `Save` メニューから設定ファイル（ `tuna-mayonnaise.json` ）を作成できます。

![tuna-demo](https://user-images.githubusercontent.com/46414076/107113423-30f0a500-68a2-11eb-879e-a3a2c375f5c9.gif)

[UI サンプル](https://solaoi.github.io/tuna-mayonnaise)

※ このサンプルは `Save` メニューをサポートしてませんが、 `Download` メニューから編集した設定を取得できます。 

### 2. 設定ファイルを利用

`tuna api` コマンドを実行すると、実行ディレクトリ内の設定ファイル（ `tuna-mayonnaise.json` ）を参照します。

このコマンドで `http://localhost:8080` にて、作成したAPIを提供することができます。

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
 | [github.com/eknkc/pug](https://github.com/eknkc/pug) | MIT License |
 | [github.com/labstack/echo](https://github.com/labstack/echo) | MIT License |
 | [github.com/labstack/echo-contrib](https://github.com/labstack/echo-contrib) | MIT License |
 | [github.com/mohae/deepcopy](https://github.com/mohae/deepcopy) | MIT License |
 | [github.com/prometheus/client_golang](https://github.com/prometheus/client_golang) | Apache License 2.0 |
 | [github.com/spf13/cobra](https://github.com/spf13/cobra) | Apache License 2.0 |

### フロントエンドの依存関係

 | ライブラリ  | ライセンス |
 | :------------- | :------------- |
 | [axios](https://www.npmjs.com/package/axios) | MIT License |
 | [file-saver](https://www.npmjs.com/package/file-saver) | MIT License |
 | [handlebars](https://www.npmjs.com/package/handlebars) | MIT License |
 | [pug](https://www.npmjs.com/package/pug) | MIT License |
 | [react](https://www.npmjs.com/package/react) | MIT License |
 | [react-dom](https://www.npmjs.com/package/react-dom) | MIT License |
 | [react-toastify](https://www.npmjs.com/package/react-toastify) | MIT License |
 | [rete](https://www.npmjs.com/package/rete) | MIT License |
 | [rete-area-plugin](https://www.npmjs.com/package/rete-area-plugin) | ISC |
 | [rete-auto-arrange-plugin](https://www.npmjs.com/package/rete-auto-arrange-plugin) | MIT License |
 | [rete-comment-plugin](https://www.npmjs.com/package/rete-comment-plugin) | MIT License |
 | [rete-connection-path-plugin](https://www.npmjs.com/package/rete-connection-path-plugin) | MIT License |
 | [rete-connection-plugin](https://www.npmjs.com/package/rete-connection-plugin) | MIT License |
 | [rete-connection-reroute-plugin](https://www.npmjs.com/package/rete-connection-reroute-plugin) | MIT License |
 | [rete-context-menu-plugin](https://www.npmjs.com/package/rete-context-menu-plugin) | MIT License |
 | [rete-history-plugin](https://www.npmjs.com/package/rete-history-plugin) | MIT License |
 | [rete-keyboard-plugin](https://www.npmjs.com/package/rete-keyboard-plugin) | ISC |
 | [rete-minimap-plugin](https://www.npmjs.com/package/rete-minimap-plugin) | MIT License |
 | [rete-react-render-plugin](https://www.npmjs.com/package/rete-react-render-plugin) | ISC |

### フロントエンド（開発用）の依存関係

 | ライブラリ  | ライセンス |
 | :------------- | :------------- |
 | [customize-cra](https://www.npmjs.com/package/customize-cra) | MIT License |
 | [react-app-rewired](https://www.npmjs.com/package/react-app-rewired) | MIT License |
 | [react-scripts](https://www.npmjs.com/package/react-scripts) | MIT License |
