FED - The Front-End Develop Kitchen
====================

FED 是一个前端开发环境，供前端编写简单的后台接口，以调试开发页面; 前端可以在此环境下，使用真实的URL访问地址访问，并可嫁接于其它服务器调试页面（调试线上代码), 可以写页面模板代码并使用测试数据调试输出，最终可生成文档。

FED 试图重新划分项目开发中前后端分工，明确各开发范围，提高项目并行开发效率，降低前后端开发的耦合度；同时为前端开发提供了可测的工具平台，使之在无后端实现情况下也可模拟后端接口及数据，测试页面功能。

[![Build Status](https://travis-ci.org/ijse/FED.png?branch=master)](https://travis-ci.org/ijse/FED)

## Features

* 支持FreeMarker模板引擎
* 支持标准的HTTP请求方法及返回数据格式
* 支持less、coffee文件的实时编译
* 可自动重启应用最新代码
* 插件机制扩展，满足大部分扩展需求

## Quick Start

1. 创建文件夹:

```
$> mkdir fedProj
$> cd fedProj
```

2. 下载安装FED:

```
$> npm install -g fed
```

3. COPY一份配置文件 "fedProj/FED/configs/index.json", 修改

4. 启动服务：

```
$> fed -sw -p 8910 ./configs/index.json
```

注：`fed -s`时必须指定配置文件~！

当修改mock文件时，FED会自动重启应用更新。


## Documentation

更多的使用说明请移步 [【WIKI】](https://github.com/ijse/FED/wiki), 文档会不定时更新。

同时，如果有任何问题请到[【issues】](https://github.com/ijse/FED/issues)给我提issue，我会尽快处理并答复的。


## Contributing

欢迎大家参与完善此工具，点右上角fork一份我的代码，然后便可以向我提交你的代码~

## Test

	> npm test

