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
* *插件机制扩展，满足大部分扩展需求

## Quick Start

1. 创建项目文件夹:

```
$> mkdir fedProj
```

2. 下载安装FED:

```
$> npm install -g fed
```

3. 创建如下目录：

```
- /fedProj
  - mock
  - view
```

4. 启动服务：

```
$> fed server -p 3000 -M mock --view-root view ./fedProj
```

- `-p 3000` http监听端口号, 默认为3000
- `-M mock` mock folder, 每个文件是一个connect的middleware, `mock`相对于`./test/res`
- `--view-root view` freemarker 的模板文件夹
- `./test/res` 项目web根目录


## Documentation

```

$> fed help

  Usage: fed [options] [command]


  Commands:

    server [options]   Launch local http service with serve2
    version            show current fed version
    help [cmd]         output usage information
    help [cmd]         display help for [cmd]
    help [cmd]         display help for [cmd]

  Options:

    -h, --help     output usage information
    -V, --version  output the version number

$> fed server -h

  Usage: fed server [options] [dir]

  Options:

    -h, --help                output usage information
    -V, --version             output the version number
    -a, --auth <user>:<pass>  specify basic auth credentials
    -F, --format <fmt>        specify the log format string
    -p, --port <port>         specify the port [3000]
    -H, --hidden              enable hidden file serving
    -S, --no-stylus           disable stylus rendering
    -J, --no-jade             disable jade rendering
        --no-less             disable less css rendering
    -I, --no-icons            disable icons
    -L, --no-logs             disable request logging
    -D, --no-dirs             disable directory serving
    -f, --favicon <path>      serve the given favicon
    -M, --mocks <path>        mock files directory
        --cookies             add cookies parse support
    -C, --cors                allows cross origin access serving
        --compress            gzip or deflate the response
        --exec <cmd>          execute command on each request

```

如果有任何问题请到[【issues】](https://github.com/ijse/FED/issues)给我提issue，我会尽快处理并答复的。


## Contributing

点右上角fork按钮

## Test

	> npm test


## License

(The MIT License)

Copyright (c) 2011 ijse;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
