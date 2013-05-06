###
	Module Loader

		Load every modules in ./
		except it's name suffered with `_disable`
###

# We have got global.MC now

fedUtil = require("../utils")

defaultConfig = require("./config.coffee")

module.exports = (gConfig)->

	console.log("Load default module config ok!");

	# Merge defaultConfig with user-defined config
	configs = fedUtil.extend(defaultConfig, gConfig)

	for mod of configs
		continue unless configs[mod].enable
		try
			require("./" + mod)(configs[mod])
			console.log "Load module [#{mod}] ok!"
		catch e
			console.error("Load module [#{mod}] failed! \n #{e}")
