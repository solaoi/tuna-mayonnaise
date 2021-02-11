# UseCase - Serve Static JSON -

*Read this in other languages: [English](README.md), [日本語](README.ja.md).*

## Table of Contents

<!-- START doctoc -->
<!-- END doctoc -->

## 3 STEP Usage

### 1. Download a configuration

download [this](https://raw.githubusercontent.com/solaoi/tuna-mayonnaise/main/samples/serve-static-json/tuna-mayonnaise.json), and save as `tuna-mayonnaise.json` .

### 2. Edit a configuration

change directory to the one that has `tuna-mayonnaise.json`, then execute this command.

```
tuna tool
```

you would see like below.

<img width="918" alt="スクリーンショット 2021-02-11 16 05 45" src="https://user-images.githubusercontent.com/46414076/107609683-08daba80-6c83-11eb-985b-1e73834ddf2b.png">

#### Disable this Endpoint

you should uncheck this Boolean Component

#### Change this content

you should edit text on this JSON Component.

default)

```
{"name": "value"}
```

#### Change this Path of Endpoint

you should edit text on this Path Component.

default)

```
/serve-static-json
```

### 3. Serve APIs on a configuration

change directory to the one that has `tuna-mayonnaise.json`, then execute this command.

```
tuna api
```

Let's access `http://localhost:8080` with your paths :)

default)

```
http://localhost:8080/serve-static-json
```
