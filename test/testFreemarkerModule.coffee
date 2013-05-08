###
	测试FTL模板引擎功能

	说明：
		1. 为避免字符编码问题，对返回的断言内容不包含中文字符
		2. FTL渲染由于是调用JAR包执行，因此效率稍低些

	@author: ijse
###

ftlEngine = require("../libs/modules/freemarker/index.coffee").init()

assert = require "assert"
path = require "path"

# Test views folder
thisPath = __dirname + "/res"
viewPath = path.join(thisPath, "ftls")

spawn = require('child_process').spawn;

describe "Freemarker模板解析测试", ->
	# helpers
	ftlRender = (tpl, data, fn) ->
		data["settings"] = {
			views: viewPath
			fileEncoding: "utf-8"
		}
		ftlEngine.renderFile path.join(viewPath, "#{tpl}.ftl"), data, fn

	# Test Suits
	it "处理简单模板（只有变量）,成功注入变量到页面", (done) ->
		dataModel =
			title: "Test Suit1: 简单变量处理"
			person: {
				name: "Oka John"
				age: 20
				email: "oka@test.com"
			}
		ftlRender "variables", dataModel, (err, data) ->
			if err then done err
			assert.notEqual(
				data.indexOf("<title>Test Suit1:"), -1)
			assert.notEqual(
				data.indexOf("<td>Oka John</td>"), -1)
			done()

	it "处理含有宏文件的模板，成功执行宏定义", (done) ->
		dataModel =
			title: "Test Suit2: 含有宏定义的页面"
			message: "Hello world!"
		ftlRender "withInMacros", dataModel, (err, data) ->
			if err then done err
			assert.notEqual(data.indexOf("<b>Message: Hello world!</b>"), -1)
			done()

	it "处理宏定义在其它文件中的宏模板", (done) ->
		dataModel =
			title: "Test Suit3: 宏定义在另一个文件中"
			message: "Hello world!"
		ftlRender "includeMacros", dataModel, (err, data) ->
			if err then done err
			assert.notEqual(data.indexOf("<b>Message: Hello world!</b>"), -1)
			done()

	it "处理include某个目录下的文件模板", (done) ->
		dataModel =
			title: "Test Suit4: 包含另一个目录下的文件内容"
		ftlRender "includeFile", dataModel, (err, data) ->
			if err then done err
			assert.notEqual(data.indexOf("I'm included file"), -1)
			done()

	it "处理Sequence类型数据", (done) ->
		dataModel =
			title: "Test Suit5: 这页有一个列表"
			shopList: [
				"beef", "water", "noodles", "egg"
			]
		ftlRender "shopList", dataModel, (err, data) ->
			if err then done err
			assert.notEqual(data.indexOf("<li>beef</li>"), -1)
			assert.notEqual(data.indexOf("<li>water</li>"), -1)
			assert.notEqual(data.indexOf("<li>egg</li>"), -1)
			done()

	it "处理含有继承的模板", (done)->
		ftlRender "child", {}, (err, data) ->
			if err then done err
			assert.notEqual(data.indexOf("<title>newTitle"), -1)
			assert.notEqual(data.indexOf("<h3>newBody"), -1)
			done()

