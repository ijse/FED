###
	Module Loader

		Load every modules in ./
		except it's name suffered with `_disable`
###

# We got Hub in global

fedUtil = require("../utils")

defaultConfig = require("./config.coffee")

module.exports = (gConfig)->

	console.log("Load default module config ok!");
	
	for mod of defaultConfig
		continue unless defaultConfig[mod].enable
		try
			# Merge defaultConfig with user-defined config
			modConfig = fedUtil.extend(defaultConfig[mod], gConfig[mod])
			require("./" + mod)(modConfig)
			console.log "Load module [#{mod}] ok!"
		catch e
			console.error("Load module [#{mod}] failed! \n #{e}")
