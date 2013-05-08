Request = require "supertest"

Hubjs = require "hubjs"
express = require "express"

global.Hub = new Hubjs()
app = new express()
app.set('static resource', __dirname + "/res/public");

configs = require("../libs/modules/config.coffee")
require("../libs/modules/coffeescript").init(configs.coffeescript)
require("../libs/modules/lesscss").init(configs.lesscss)

Hub.emit "localServer.loadRoute.before", { app: app }

request = Request(app)

describe "测试即时编译模块功能", (done)->
	it "请求获得test.js文件", (done)->
		request
			.get("/js/test.js")
			.expect(200)
			.end(done)
	it "请求获得test.css文件内容", (done)->
		request
			.get("/css/test.css")
			.expect(200)
			.end(done)


