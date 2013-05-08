
coffeeMiddleware = require "coffee-middleware"
express = require "express"
os = require "os"
path = require "path"

exports.init = (coffeeCfg)->

	Hub.on "localServer.loadRoute.before", (param)->
		app = param.app
		coffeeCfg.src = app.get "static resource"
		coffeeCfg.dest = if not coffeeCfg.useTmpDir then coffeeCfg.src else path.join(os.tmpDir(), "tmp_fed_coffee")
		app.use coffeeMiddleware(coffeeCfg)
		app.use express["static"](coffeeCfg.dest) if coffeeCfg.useTmpDir
