lessMiddleware = require("less-middleware")
express = require("express")
os = require("os")
path = require("path")

exports.init = (lessCfg)->

	Hub.on "localServer.loadRoute.before", (param)->
		app = param.app
		lessCfg.src = app.get("static resource")

		if lessCfg.useTmpDir
			lessCfg.dest = path.join os.tmpDir(), "tmp_fed_less"
		else if not lessCfg.dest
			lessCfg.dest = lessCfg.src
		app.use(lessMiddleware(lessCfg))
		if lessCfg.useTmpDir
			app.use(express["static"](lessCfg.dest))
