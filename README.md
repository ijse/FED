FED - The Front-End Develop Kitchen
====================

FED 是一个前端开发环境，供前端编写简单的后台接口，以调试开发页面; 前端可以在此环境下，使用真实的URL访问地址访问，并可嫁接于其它服务器调试页面（调试线上代码), 可以写页面模板代码并使用测试数据调试输出，最终可生成文档。

FED 重新划分了项目开发中前后端分工，明确了各开发范围，提高了项目并行开发效率，降低了前后端开发的耦合度；同时为前端开发提供了可测的工具平台，使之在无后端实现情况下也可模拟后端接口及数据，测试页面功能。

[![Build Status](https://travis-ci.org/ijse/FED.png?branch=master)](https://travis-ci.org/ijse/FED)

## 特性

* 支持FreeMarker模板渲染
* 支持配置模板全局变量
* 支持FreeMarker模板继承语法
* 支持各种格式的返回数据
* 支持GET、POST等所有HTTP请求，可修改HTTP头
* 支持AJAX、JSONP请求
* 内含http-proxy模块，支持调试线上代码
* 真实URL地址访问，与线上访问保持一致
* 支持基于代码注释标记的文档输出功能
* 插件机制扩展，满足大部分扩展需求

## 使用步骤

1. 创建文件夹:

```
$> mkdir fedProj
```

2. 下载FED:

```
$> git clone https://github.com/ijse/FED
```

3. 修改配置文件 "fedProj/FED/configs/index.json"

4. 安装依赖:

```
$> cd fedProj/FED
$> npm install
```

5. 启动服务：

```
$> fed run -C ./configs/index.json -P 80
```

注：`fed run`时必须指定配置文件参数~！

另外，为了开发方便，需要本地装有`node-dev`, 可以通过npm直接安装：`npm install -g node-dev`;

## 页面模板说明

目前支持freemarker和ejs两种模板引擎，可以同时使用。

在配置文件中配置全局公共变量，可在任意模板文件里引用。

freemarker模板已经内置对于模板继承的支持，可直接在模板中使用`<@override />`、`<@block />`和`<@extend />`命令；其它与在JAVA环境下写法一致。

freemarker模板文件可直接放到JAVA环境中使用。

## 怎样写backend

backend是模拟后台数据代码，可使用JS以简单的JSON格式描述后端与前端的接口和数据定义，并用于测试，且可使用fed_doc插件直接生成描述文档。

backend的主要作用是描述：

1. HTTP请求方法和URL
2. 请求接收参数
3. 请求返回数据

前端页面（页面模板、JS）与以上三点是直接相关的，而作为前端，撰写backend也只需要写好以上三点即可，无需关心具体的业务实现逻辑及数据存取。（当然，也可以写简单的业务逻辑和数据存取，只是这些与前端页面展现无关）我们需要的仅仅是一个后端接口，关心的是请求方法和数据，测试中这样的东西叫“桩”。

以下是一个最简单的例子， 浏览器中访问/test, 将会调用folder/test.ftl模板，并向内添加变量"articalName",其值是"Hello~!":

```javascript
module.exports = {
	"get /test": function() {
		this.render.ftl("folder/test", {
			"articalName": "Hello~!"
			});
	}
};
```

说明：

1. 每个backend文件都只是个js文件
2. 需要具有`module.exports = {}`, 且只能暴露这种格式接口
3. `"get /test"`表示HTTP get请求，请求路径是/test
4. `function(){...}`中定义了数据及返回方式，`this.render`对象中封装了一些常用的数据返回打包工具。

在backend中我们也可以获得标准的request和response对象，于是便可以做更多的操作：

```javascript
"post /regist": function(req, res) {
	var name = req.param("username");
	var pass = req.param("password");

	if(username == "ijse") {
		this.render.ftl("succ.ftl", {
			success: true,
			user: {
				name: "ijse",
			}
		});
	} else {
		this.render.ftl("fail.ftl", {
			success: false,
			error: "Username wrong!!"
		});
	}
}
```

上面例子中，我们使用`req`来获得表单POST提交的参数，并作了简单的逻辑判断，然后根据判断结果分别返回了不同的视图和数据。

因为FED是基于express做的，站在巨人的肩膀上，因此所能做的其实更多，同样也可以支持RESTful格式的URL：

```javascript
"post /show/:id": function(req, res) {
	var id = req.param("id");
	...
}
```

另外，返回的数据还可以是文件：

```javascript
"post /download/:id": function(req, res) {
	var id = req.param("id");
	res.sendfile("path/to/file");
}
```

或者其它更多, 完全可以满足我们需求，可以完全模拟一个后端实现。

## 有关注释的规范

一直认为注释不应该有太严格的格式，不应该写起来太繁琐。本着简单和实用的原则，在FED中写backend接口注释很简单, 以上面下载文件的例子：

```javascript
"post /download/:id": function(req, res) {
	/**
	 * 根据ID下载文件
	 *	直接返回文件实体，浏览器打开保存文件对话框
	 *
	 * @author ijse
	 * @param id 要下载的文件ID
	 * @return 对应文件
	 */
	var id = req.param("id");
	res.sendfile("path/to/file");
}
```

注释不是强制的，但最后在注释中写明接口名称、请求参数、返回数据格式。所唯一要注意的是：

1. 注释要在方法内
2. 注释要`/**... */`这种格式

如此这般，我们便可以使用fed_doc来直接生成文档了：

```
$> fed doc -f path/to/backend -d file/to/save.html
```

文档生成后只有一个HTML文件，可以直接用浏览器打开浏览。

## 代理功能说明

FED的代理功能可实现与后端Tomcat对接，或调试线上代码。替代了使用Nginx的方式，可直接通过配置路由和相关参数实现请求的代理转发。

类似Nginx的`proxy_pass`, FED的代理功能可以实现“线上调试”，同时开发中也可以使用此方法来使开发时环境与发布上线后访问环境一致，从而避免一些部署问题。

此功能对于前端的价值在于：可以在使用线上其它请求和资源的同时，替换某些请求或资源为本地可修改的。

例如：

1. 项目已经上线（跑在某服务器上），前端需要修改页面。传统方式需要搭建本地环境，准备数据；但使用FED代理，通过配置可以单独修改调试某请求内容。
2. 线上项目出现页面BUG（显示，或JS业务逻辑），需要紧急修复，使用FED代理可以使用线上真实环境（数据）进行调试。
3. 开发时，前端本地可以不启动Tomcat等容器，而使用其它服务器上的现成的服务，使某些请求使用其它服务器提供的内容，某些请求使用本地提供的内容。

### 配置代理

修改以下内容，并将它放在FED启动配置文件中即可：

```
"proxy": {
	"enable": true,
	"port": 80,
	"router": {
		"cy4749.cyou-inc.com": "localhost:81",
		"app.changyou.com": "localhost:3000"
	},
	"remote": {
		"host": "123.126.70.39",
		"port": 80
	}
}
```

说明：

* enable: 是否启用代理功能
* port:	代理端口，即URL访问端口、项目上线后的服务端口
* router: 路由设置，将某URL请求路由到另一地址
* remote: 远程服务地址设置，当本地路由表无匹配时，请求将被转发到remote

FED启动时，会监听两个端口：80和3000，分别是代理服务端口及本地Nodejs服务端口，访问80端口地址即可。

## 插件编写规则

FED的核心其实是WEB服务，其它如对FreeMarker模板的支持、生成文档都是以插件的形式添加的，因此扩展性很强，可以为其灵活地添加很多功能，扩展FED。

FED的插件机制在JS灵活性下，约束很小，设计也很简单，但却很实用。在程序启动时，自动初始化插件，然后将插件实例保存供调用。

插件编写起来也非常简单，主要遵循以下两个约定：

1. 所有插件均放在/plugins目录下，插件文件夹名字即是插件名称
2. 每个插件入口是`index.js`文件，且此文件中包含`init()`接口
3. 整个插件的所有资源文件都在插件目录下，不要放在其它文件夹中


下面是一个插件示例：

```javascript
exports.init = function(opts) {
	this.on("appinit1", function(app) {
		app.set("some variable", "hello world");
	});
};

exports.doSth = function() {
	return "Hello";
}
```

上面插件在初始化第一阶段时，为`app`添加了变量，并暴露了`doSth()`接口。

说明：

* `exports.init()`方法无返回值时，默认返回`exports`对象。
* `exports.init()`方法会有一个opts参数，这参数即插件配置参数，在程序启动配置文件中配置。
* `this.on()`可以绑定插件执行事件，目前主要绑定事件见下文。

附：
  插件可绑定的事件如下：

  1. appinit1
  2. appinit2
  3. appinit3
  4. appinit4
  5. midbefore
  6. midafter
  7. commandinit
  8. localserverstart
  9. proxyserverstart

具体事件介绍，请大家看源码，搜索"//!!PLUGIN EMIT"。

## FED的其它集成工具(TODO)

FED的其它工具都是以插件形式装载进来的，通过命令方式启动。

### 输出静态HTML文件

### 压缩优化JS文件
### 目录结构转换
### 部署到服务器

## Test

	> npm test

