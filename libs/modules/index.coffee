###
	Module Loader

		Load every modules in ./
		except it's name suffered with `_disable`
###

# We got Hub in global

fedUtil = require("../utils")

# TODO: 启动时从每个目录下寻找配置文件加载，
defaultConfig = require("./config.coffee")

# module.exports = (gConfig)->

# Initialize all modules with config
exports.init = (gConfig)->

	# console.log("Load default module config ok!");

	for mod of defaultConfig
		continue unless defaultConfig[mod].enable
		try
			# Merge defaultConfig with user-defined config
			modConfig = fedUtil.extend(defaultConfig[mod], gConfig[mod])
			require("./" + mod).init?(modConfig)
			# console.log "Load module [#{mod}] ok!"
		catch e
			console.error("Load module [#{mod}] failed! \n #{e}")

# Load commands
exports.initCommand = ()->
	cmdMap = {}
	for mod of defaultConfig
		# Default command name is the name of module
		cmdName = mod
		config = defaultConfig[mod]
		continue unless config.enable and config.command
		try
			# if config.command is object with key "name"
			cmdName = config.command.name
			cmdMap[cmdName] = {
				name: cmdName
				fn: require("./" + mod).exec
				options: config.command.options
				showHelp: config.command.manual
			}
		catch e
			console.error("Load module [#{mod}] failed! \n #{e}")

	return cmdMap