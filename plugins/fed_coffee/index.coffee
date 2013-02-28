coffeeMiddleware = require "coffee-middleware"
express = require "express"
os = require "os"

exports.init = (config)->
	coffeeCfg = {
		force: true
		once: false
		debug: true
		src: ""
		dest: ""
		prefix: ""
		useTmpDir: true
	}

	this.on "appinit2", (app)->
		coffeeCfg.src = app.get "static resource"

		coffeeCfg.dest = if not coffeeCfg.useTmpDir then coffeeCfg.src else os.tmpDir()

		app.use coffeeMiddleware(coffeeCfg)

		app.use express["static"](os.tmpDir())