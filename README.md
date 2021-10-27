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

- [!tuna-mayonnaise](#)
  - [Table of Contents](#table-of-contents)
  - [Why](#why)
  - [Get Started](#get-started)
    - [Install](#install)
      - [For MacOS (Homebrew)](#for-macos-homebrew)
      - [For Others (Binary Releases)](#for-others-binary-releases)
    - [Usage](#usage)
      - [1. Launch a tool on your browser](#1-launch-a-tool-on-your-browser)
      - [2. Serve your JSON/HTML](#2-serve-your-jsonhtml)
  - [Tool Features](#tool-features)
    - [Template Engine](#template-engine)
    - [API](#api)
    - [Database](#database)
      - [Connection Options](#connection-options)
        - [TLS / SSL](#tls--ssl)
  - [API Features](#api-features)
    - [Monitoring](#monitoring)
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
VERSION=v0.0.4
## set the OS you use.
OS=linux
## case you use wget
wget https://github.com/solaoi/tuna-mayonnaise/releases/download/$VERSION/tuna_${OS}_amd64.tar.gz
## case you use curl
curl -LO  https://github.com/solaoi/tuna-mayonnaise/releases/download/$VERSION/tuna_${OS}_amd64.tar.gz
## extract
tar xvf ./tuna_${OS}.tar.gz
## move it to a location in your $PATH, such as /usr/local/bin.
mv ./tuna /usr/local/bin/

# Update
tuna update
```

### Usage

#### 1. Launch a tool on your browser

`tuna tool` command launches a browser like below.

this tool generate a configuration( `tuna-mayonnaise.json` ) with `Save` menu.

![tuna-demo](https://user-images.githubusercontent.com/46414076/128729100-5f37d74d-3df8-4f4b-acac-81334b52dd3d.gif)

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
- PostgreSQL

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

## API Features

### Monitoring

1. TUNA-Mayonnaise exposes Prometheus metrics at `/metrics` endpoint.   
List of metrics includes two stats.

- basic http stats collected via Echo Prometheus library.
- TUNA-Mayonnaise API Component stats with status, method, url.

2. TUNA-Mayonnaise exposes health endpoint at `/health` .

3. TUNA-Mayonnaise Logging with Labeled Tab-separated Values ( `LTSV` ) format.

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

### FRONTEND DEV Dependencies

 | Dependency  | License |
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
