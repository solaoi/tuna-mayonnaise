![tuna-mayonnaise](https://user-images.githubusercontent.com/46414076/107111813-4b248600-6896-11eb-885d-592b90af0b09.png)

![license](https://img.shields.io/github/license/solaoi/tuna-mayonnaise)
![CodeQL](https://github.com/solaoi/tuna-mayonnaise/workflows/CodeQL/badge.svg)

TUNA-Mayonnaise is a Low Layer CMS.

This application is a tool to generate and serve JSON/HTML with flow model.

[UI Sample](https://solaoi.github.io/tuna-mayonnaise)

\* this sample does not support `Save` menu, but we could `Download` a configuration editted.

## Get Started

### Binary Releases

you can download a binary release [here](https://github.com/solaoi/tuna-mayonnaise/releases).

place it in $PATH directory.

### Homebrew

```
brew install solaoi/tap/tuna
```

## Create your API on Edit-Tool

```
tuna tool
```

this commnad opens a edit-tool on `http://localhost:3000`.

## Save your API on Edit-Tool

right-click shows you context menu, then you should choose Save option!

you get configuration file(tuna-mayonnaise.json) on current dir.

this file is all to manage this tool.

## Serve your API

```
tuna api
```

this commnad require tuna-mayonnaise.json on current dir.

let's access your endpoints :)

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
 | [react-scripts](https://www.npmjs.com/package/react-scripts) | MIT License |
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
 | [typescript](https://www.npmjs.com/package/typescript) | Apache License 2.0 |
