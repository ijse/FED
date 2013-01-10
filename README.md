FED - feed front end
====================

## 简介

FED 是一个前端开发环境，供前端编写简单的后台接口，以调试开发页面; 前端可以在此环境下，使用真实的URL访问地址访问，并可嫁接于其它服务器调试页面（调试线上代码), 可以写页面模板代码并使用测试数据调试输出，最终可生成文档。


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

## 使用步骤

1. 创建文件夹:

	$> mkdir fedProj

2. 下载FED:

	$> git clone https://github.com/ijse/FED

3. 修改配置文件"fedProj/FED/configs/index.json"

4. 安装依赖:

	$> cd fedProj/FED
	$> npm install

5. 启动服务：

	$> node-dev launcher.js

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

	module.exports = {
		"get /test": function() {
			this.render.ftl("folder/test", {
				"articalName": "Hello~!"
				});
		}
	};

说明：
	1. 每个backend文件都只是个js文件
	2. 需要具有`module.exports = {}`, 且只能暴露这种格式接口
	3. `"get /test"`表示HTTP get请求，请求路径是/test
	4. `function(){...}`中定义了数据及返回方式，`this.render`对象中封装了一些常用的数据返回打包工具。

在backend中我们也可以获得标准的request和response对象，于是便可以做更多的操作：

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

上面例子中，我们使用`req`来获得表单POST提交的参数，并作了简单的逻辑判断，然后根据判断结果分别返回了不同的视图和数据。

因为FED是基于express做的，站在巨人的肩膀上，因此所能做的其实更多，同样也可以支持RESTful格式的URL：

	"post /show/:id": function(req, res) {
		var id = req.param("id");
		...
	}

另外，返回的数据还可以是文件：

	"post /download/:id": function(req, res) {
		var id = req.param("id");
		res.sendfile("path/to/file");
	}

或者其它更多, 完全可以满足我们需求，可以完全模拟一个后端实现。

## 有关注释的规范

一直认为注释不应该有太严格的格式，不应该写起来太繁琐。本着简单和实用的原则，在FED中写backend接口注释很简单, 以上面下载文件的例子：

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

注释不是强制的，但最后在注释中写明接口名称、请求参数、返回数据格式。所唯一要注意的是：
	1. 注释要在方法内
	2. 注释要`/**... */`这种格式

如此这般，我们便可以使用fed_doc来直接生成文档了：


## 代理功能说明

FED的代理功能可实现与后端Tomcat对接，或调试线上代码。替代了使用Nginx的方式，可直接通过配置路由和相关参数实现请求的代理转发。


## FED的其它集成工具(TODO)

### 输出静态HTML文件
### 压缩优化JS文件
### 目录结构转换
### 部署到服务器

## Test

	> npm test

