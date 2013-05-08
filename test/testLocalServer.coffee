###
	测试localService

	说明: 不再测试所用到的框架的功能

	@author: ijse
###

TEST_PORT = 3210

assert = require "assert"
Request = require "supertest"
localServer = require "../libs/modules/server/localServer"
global.Hub = require("hubjs")()

# Set up local service
request = Request(localServer.create {
	server: {
		path: {
			view: __dirname + "/res/views",
			public: __dirname + "/res/public",
			mock: __dirname + "/res/backend",
		},
		proxy: {
			enable: false
		}
	}
})

describe "基本功能测试", ->
	describe "测试GET请求", ->
		it "请求静态文本内容", (done)->
			request
				.get("/test")
				.expect(200, "hello fed")
				.end(done)
		it "请求不存在的地址", (done)->
			request
				.get("/other")
				.expect(404, done)
		it "请求静态资源文件", (done)->
			request
				.get("/index.html")
				.expect(200, /<h1>hello static html file<\/h1>/, done)
	describe "测试POST请求", ->
		it "不带参数请求", (done)->
			request
				.post("/post")
				.expect(200, "hello fed")
				.end(done)
		it "带参数的POST请求", (done)->
			request
				.post("/post-with-param")
				.send({name: "ijse"})
				.expect(200, "hello, ijse", done)
	describe "测试正则URL匹配", ->
		it "正确匹配 -> get (/.*\\.do$) ", (done)->
			request
				.get("/testReg.do")
				.expect(200, "ok")
				.end(done)
		it "不会匹配 -> get (/.*\\.do$) ", (done)->
			request
				.get("/testReg")
				.expect(404)
				.end(done)
		it "不会匹配 -> get (/.*\\.do$) ", (done)->
			request
				.get("/testReg.done")
				.expect(404)
				.end(done)
