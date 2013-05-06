lessMiddleware = require("less-middleware")
express = require("express")
os = require("os")
path = require("path")

module.exports = (config)->
	lessCfg = {
		dest: config.dest,
		force: config.force || {},
		useTmpDir: config.useTmpDir || false,
		# paths: "",
		# prefix: "",
		optimization: config.optimization || 1,
		debug: config.debug || true,
		compress: config.compress || false,
		dumpLineNumbers: config.dumpLineNumbers || "mediaquery"
	}

	Hub.on "localServer.loadRoute.before", (param)->
		app = param.app
		lessCfg.src = app.get("static resource")

		if config.useTmpDir
			lessCfg.dest = path.join os.tmpDir(), "tmp_fed_less"
		else if not lessCfg.dest
			lessCfg.dest = lessCfg.src
		app.use(lessMiddleware(lessCfg))
		if lessCfg.useTmpDir
			app.use(express["static"](lessCfg.dest))
