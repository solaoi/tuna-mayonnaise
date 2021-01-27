# TUNA-Mayonnaise

This is a Low Layer CMS.

This application is a tool to generate and serve JSON/HTML with flow model.

## Get Started

[Install here](https://github.com/solaoi/tuna-mayonnaise/releases/tag/v0.0.2-alpha)

### Run Edit-Tool

this commnad opens browser on `http://localhost:3000`,

then you could use edit-tool.

```
tuna tool
```

### Connect inputs to Endpoint on Edit-Tool

this endpoint is served on api command.

ex)

if you connect Path(/example) to Endpoint,

api command serves `http://localhost:8080/example` .

### Save your flow on Edit-Tool

right-click shows you context menu, then you should choose save option!

you get configuration file(tuna-mayonnaise.json) on current dir.

this file is all to manage this tool.

### Run API with Tool-Data

this commnad serves endpoints you saved.

let's access your endpoints :)

```
tuna api
```
