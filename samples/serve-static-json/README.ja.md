# 活用例 - 静的なJSONを返すサーバー作成 -

*他の言語で読む：[English](README.md)、[日本語](README.ja.md)*

## 目次

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>CLICK</summary>

- [手順](#%E6%89%8B%E9%A0%86)
  - [1. 設定ファイルをダウンロード](#1-%E8%A8%AD%E5%AE%9A%E3%83%95%E3%82%A1%E3%82%A4%E3%83%AB%E3%82%92%E3%83%80%E3%82%A6%E3%83%B3%E3%83%AD%E3%83%BC%E3%83%89)
  - [2. 設定を編集](#2-%E8%A8%AD%E5%AE%9A%E3%82%92%E7%B7%A8%E9%9B%86)
  - [3. 設定を元にサーバーを作成](#3-%E8%A8%AD%E5%AE%9A%E3%82%92%E5%85%83%E3%81%AB%E3%82%B5%E3%83%BC%E3%83%90%E3%83%BC%E3%82%92%E4%BD%9C%E6%88%90)

</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## 手順

### 1. 設定ファイルをダウンロード

[こちら](https://raw.githubusercontent.com/solaoi/tuna-mayonnaise/main/samples/serve-static-json/tuna-mayonnaise.json)から設定ファイルをダウンロードし、`tuna-mayonnaise.json` という名前で保存します。

### 2. 設定を編集

先程ダウンロードした `tuna-mayonnaise.json` があるディレクトリに移動し、下記コマンドを実行します。

```
tuna tool
```

実行すると、下記画面でブラウザが開きます。

<img width="918" alt="スクリーンショット 2021-02-11 16 05 45" src="https://user-images.githubusercontent.com/46414076/107609683-08daba80-6c83-11eb-985b-1e73834ddf2b.png">

#### エンドポイントを無効化する場合

Booleanコンポーネントでチェックを外すと、そのエンドポイントは提供されなくなります。

#### 返却するJSONを変更する場合

JSONコンポーネントのテキストボックスを編集してください。

デフォルト）

```
{"name": "value"}
```

#### 提供するエンドポイントのパスを変更する場合

Pathコンポーネントのテキストボックスを編集してください。

デフォルト）

```
/serve-static-json
```

### 3. 設定を元にサーバーを作成

`tuna-mayonnaise.json` があるディレクトリで、下記コマンドを実行します。

```
tuna api
```

設定したパスとともに `http://localhost:8080` にアクセスしてみましょう。

デフォルト）

```
http://localhost:8080/serve-static-json
```
