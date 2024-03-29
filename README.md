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

*Read this in other languages: [English](README.md), [日本語](README.ja.md).*

<h2 align="center">
TUNA-Mayonnaise generates and serves JSON/HTML with the node-based editor.
</h2>

<div align="center">
  <a href="https://github.com/solaoi/tuna-mayonnaise">
    <img alt="tuna-mayonnaise-demo" src="https://user-images.githubusercontent.com/46414076/168936743-9af035eb-2cdd-42c8-9d5c-d2fdc2a70f01.gif">
  </a>
</div>

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>CLICK</summary>

- [Why](#why)
- [Get Started](#get-started)
  - [Install](#install)
  - [Usage](#usage)
- [Features](#features)
  - [Template Engine](#template-engine)
  - [API](#api)
  - [Database](#database)
  - [Monitoring](#monitoring)
- [Dependencies](#dependencies)
  - [BACKEND Dependencies](#backend-dependencies)
  - [FRONTEND Dependencies](#frontend-dependencies)
  - [FRONTEND DEV Dependencies](#frontend-dev-dependencies)

</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Why

There are many web frameworks in the world, and you must be using one or several of them for your web development.   
In any of these frameworks, you may have found many patterns and are getting tired of writing the same process.

If you are a very good engineer, you want to write all the patterns in one configuration file.   
However, both YAML and JSON are a bit inadequate to express the patterns of today's web development.   

So, why don't we use a visual programming UI to express each pattern by connecting settings with lines?
The result of such an attempt is TUNA-Mayonnaise, the most famous ingredient in rice balls.

## Get Started

### Install

TUNA-Mayonnaise only supports amd64.

#### For MacOS (Homebrew)

```sh
# Install
brew install solaoi/tap/tuna
# Update
brew upgrade tuna
```

#### For Others (Binary Releases)

you can download a binary release [here](https://github.com/solaoi/tuna-mayonnaise/releases).

```sh
# Install with wget or curl
## set the latest version on releases.
VERSION=v0.0.29
## set the OS you use.
OS=linux
## case you use wget
wget https://github.com/solaoi/tuna-mayonnaise/releases/download/$VERSION/tuna_${OS}_amd64.tar.gz
## case you use curl
curl -LO  https://github.com/solaoi/tuna-mayonnaise/releases/download/$VERSION/tuna_${OS}_amd64.tar.gz
## extract
tar xvf ./tuna_${OS}_amd64.tar.gz
## move it to a location in your $PATH, such as /usr/local/bin.
mv ./tuna /usr/local/bin/

# Update
tuna update
```

### Usage

#### 1. Launch a tool on your browser

`tuna tool` command launches a browser like below.

this tool generate a configuration( `tuna-mayonnaise.json` ) with `Save` menu.

[Tool Sample](https://solaoi.github.io/tuna-mayonnaise)

\* this sample does not support the `Save` menu, but we could `Download` a configuration edited.

#### 2. Serve your JSON/HTML

`tuna api` command serves your JSON/HTML on `http://localhost:8080` .

this command use a configuration( `tuna-mayonnaise.json` ) on current directory.

## Features

### Template Engine

When you generate your HTML, you could use Template Engines below.

- Pug
- Handlebars

### API

You could request WEB APIs and use responses.

### Database

This tool supports databases below.

- MySQL
- PostgreSQL
- SQLite3

You could access the data in JSON format.

e.g.)

If there is a table like below, 

 | id  | name |
 | :------------- | :------------- |
 | 1 | foo |
 | 2 | bar |

You get the response like below.

```json
[
  {"id":1, "name":"foo"},
  {"id":2, "name":"bar"}
]
```

#### Connection Options

##### TLS / SSL

- MySQL: [tls](https://github.com/go-sql-driver/mysql#tls)
- PostgreSQL: [sslmode](https://pkg.go.dev/github.com/lib/pq#hdr-Connection_String_Parameters)

### Monitoring

1. TUNA-Mayonnaise exposes Prometheus metrics at `/metrics` endpoint.   
List of metrics includes two stats.

- basic http stats collected via Echo Prometheus library.
- TUNA-Mayonnaise API Component stats with status, method, url.

2. TUNA-Mayonnaise exposes health endpoint at `/health` .

3. TUNA-Mayonnaise Logging with Labeled Tab-separated Values ( `LTSV` ) format.

## Dependencies

TUNA-Mayonnaise stands on the shoulder of many great open source libraries, in lexical order:

### BACKEND Dependencies

 | Dependency  | License |
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

### FRONTEND Dependencies

 | Dependency  | License |
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

### FRONTEND DEV Dependencies

 | Dependency  | License |
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
