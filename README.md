# ![tuna-mayonnaise](https://user-images.githubusercontent.com/46414076/107111813-4b248600-6896-11eb-885d-592b90af0b09.png)

![license](https://img.shields.io/github/license/solaoi/tuna-mayonnaise)
![CodeQL](https://github.com/solaoi/tuna-mayonnaise/workflows/CodeQL/badge.svg)

*Read this in other languages: [English](README.md), [日本語](README.ja.md).*

TUNA-Mayonnaise is a CommandLineTool to generate and serve JSON/HTML on the node-based editor.

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>CLICK</summary>

- [Get Started](#get-started)
  - [Install](#install)
  - [Usage](#usage)
- [Tool Features](#tool-features)
  - [Template Engine](#template-engine)
  - [API](#api)
  - [Database](#database)
- [API Features](#api-features)
  - [Monitoring](#monitoring)
  - [Options](#options)
- [UseCases](#usecases)
  - [1. Serve Static JSON](#1-serve-static-json)
  - [2. Serve Static HTML](#2-serve-static-html)
  - [3. Serve Dynamic JSON](#3-serve-dynamic-json)
  - [4. Serve Dynamic HTML](#4-serve-dynamic-html)
- [Dependencies](#dependencies)
  - [BACKEND Dependencies](#backend-dependencies)
  - [FRONTEND Dependencies](#frontend-dependencies)
  - [FRONTEND DEV Dependencies](#frontend-dev-dependencies)

</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Get Started

### Install

#### For MacOS (Homebrew)

```sh
# Install
brew install solaoi/tap/tuna
# Update
brew upgrade tuna
```

#### For Others (Binary Releases)

you can download a binary release [here](https://github.com/solaoi/tuna-mayonnaise/releases).

### Usage

#### 1. Launch a tool on your browser

`tuna tool` command launches a browser like below.

this tool generate a configuration( `tuna-mayonnaise.json` ) with `Save` menu.

![tuna-demo](https://user-images.githubusercontent.com/46414076/107113423-30f0a500-68a2-11eb-879e-a3a2c375f5c9.gif)

[Tool Sample](https://solaoi.github.io/tuna-mayonnaise)

\* this sample does not support the `Save` menu, but we could `Download` a configuration edited.

#### 2. Serve your JSON/HTML

`tuna api` command serves your JSON/HTML on `http://localhost:8080` .

this command use a configuration( `tuna-mayonnaise.json` ) on current directory.

## Tool Features

### Template Engine

When you generate your HTML, you could use Template Engines below.

- Pug
- Handlebars

### API

You could request WEB APIs and use responses.

### Database

This tool supports databases below.

- MySQL
- PostgreSQL (WIP

You could access the data in JSON format.

ex)

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

## API Features

### Monitoring

1. TUNA-Mayonnaise exposes Prometheus metrics at `/metrics` endpoint.   
List of metrics includes two stats.

- basic http stats collected via Echo Prometheus library.
- TUNA-Mayonnaise API Component stats with status, method, url.

2. TUNA-Mayonnaise exposes health endpoint at `/health` .

3. TUNA-Mayonnaise Logging with Labeled Tab-separated Values ( `LTSV` ) format.

### Options

1. Port   
Defalut port is 8080.   
We could set other port with a environment variable like below.

```
PORT=9999 tuna api
```

2. Prometheus Metrics   
Default is ON, and we could access metrics with `/metrics`   
We could set OFF with a environment variable like below.

```
PROM=OFF tuna api
```

## UseCases

### 1. Serve Static JSON

see [here](samples/serve-static-json/README.md).

### 2. Serve Static HTML

see [here](samples/serve-static-html/README.md).

### 3. Serve Dynamic JSON

see [here](samples/serve-dynamic-json/README.md).

### 4. Serve Dynamic HTML

see [here](samples/serve-dynamic-html/README.md).

## Dependencies

TUNA-Mayonnaise stands on the shoulder of many great open source libraries, in lexical order:

### BACKEND Dependencies

 | Dependency  | License |
 | :------------- | :------------- |
 | [github.com/aymerick/raymond](https://github.com/aymerick/raymond) | MIT License |
 | [github.com/christopherhein/go-version](https://github.com/christopherhein/go-version) | Apache License 2.0 |
 | [github.com/common-nighthawk/go-figure](https://github.com/common-nighthawk/go-figure) | MIT License |
 | [github.com/eknkc/pug](https://github.com/eknkc/pug) | MIT License |
 | [github.com/go-sql-driver/mysql](https://github.com/go-sql-driver/mysql) | MPL-2.0 License |
 | [github.com/labstack/echo](https://github.com/labstack/echo) | MIT License |
 | [github.com/labstack/echo-contrib](https://github.com/labstack/echo-contrib) | MIT License |
 | [github.com/mohae/deepcopy](https://github.com/mohae/deepcopy) | MIT License |
 | [github.com/prometheus/client_golang](https://github.com/prometheus/client_golang) | Apache License 2.0 |
 | [github.com/spf13/cobra](https://github.com/spf13/cobra) | Apache License 2.0 |

### FRONTEND Dependencies

 | Dependency  | License |
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

### FRONTEND DEV Dependencies

 | Dependency  | License |
 | :------------- | :------------- |
 | [customize-cra](https://www.npmjs.com/package/customize-cra) | MIT License |
 | [react-app-rewired](https://www.npmjs.com/package/react-app-rewired) | MIT License |
 | [react-scripts](https://www.npmjs.com/package/react-scripts) | MIT License |
