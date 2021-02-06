![tuna-mayonnaise](https://user-images.githubusercontent.com/46414076/107111813-4b248600-6896-11eb-885d-592b90af0b09.png)

![license](https://img.shields.io/github/license/solaoi/tuna-mayonnaise)
![CodeQL](https://github.com/solaoi/tuna-mayonnaise/workflows/CodeQL/badge.svg)

*Read this in other languages: [English](README.md), [日本語](README.ja.md).*

TUNA-Mayonnaise is a CommandLineTool to generate and serve JSON/HTML with Visual Programming.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<!-- param::title::'**Table of Contents**':: -->
'**Table of Contents**'

- [Get Started](#get-started)
  - [Binary Releases](#binary-releases)
  - [Homebrew](#homebrew)
- [2 STEP Usage](#2-step-usage)
  - [1. Create a configuration](#1-create-a-configuration)
  - [2. Use a configuration](#2-use-a-configuration)
- [Dependencies](#dependencies)
  - [BACKEND Dependencies](#backend-dependencies)
  - [FRONTEND Dependencies](#frontend-dependencies)
  - [FRONTEND DEV Dependencies](#frontend-dev-dependencies)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Get Started

### Binary Releases

you can download a binary release [here](https://github.com/solaoi/tuna-mayonnaise/releases).

### Homebrew

```
brew install solaoi/tap/tuna
```

## 2 STEP Usage

### 1. Create a configuration

`tuna tool` command launch a browser like below.

this ui generate a configuration with `Save` menu.

![tuna-demo](https://user-images.githubusercontent.com/46414076/107113423-30f0a500-68a2-11eb-879e-a3a2c375f5c9.gif)

[UI Sample](https://solaoi.github.io/tuna-mayonnaise)

\* this sample does not support `Save` menu, but we could `Download` a configuration editted.

### 2. Use a configuration

`tuna api` command use a configuration named `tuna-mayonnaise.json` on current directory.

this command serve your endpoints on `http://localhost:8080` .

## Dependencies

TUNA-Mayonnaise stands on the shoulder of many great open source libraries, in lexical order:

### BACKEND Dependencies

 | Dependency  | License |
 | :------------- | :------------- |
 | [github.com/aymerick/raymond](https://github.com/aymerick/raymond) | MIT License |
 | [github.com/eknkc/pug](https://github.com/eknkc/pug) | MIT License |
 | [github.com/labstack/echo](https://github.com/labstack/echo) | MIT License |
 | [github.com/mohae/deepcopy](https://github.com/mohae/deepcopy) | MIT License |
 | [github.com/spf13/cobra](https://github.com/spf13/cobra) | Apache License 2.0 |
 | [github.com/spf13/viper](https://github.com/spf13/viper) | MIT License |

### FRONTEND Dependencies

 | Dependency  | License |
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

### FRONTEND DEV Dependencies

 | Dependency  | License |
 | :------------- | :------------- |
 | [customize-cra](https://www.npmjs.com/package/customize-cra) | MIT License |
 | [react-app-rewired](https://www.npmjs.com/package/react-app-rewired) | MIT License |
 | [react-scripts](https://www.npmjs.com/package/react-scripts) | MIT License |
 | [typescript](https://www.npmjs.com/package/typescript) | Apache License 2.0 |
