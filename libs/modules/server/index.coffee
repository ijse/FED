path         = require("path")
watch        = require("nodewatch")
fedUtil      = require("../../utils")
childProcess = require("child_process")

# localServer process handler
pChild = null

exports.exec = (argv, config)->
	# Format configs
	cfgFile = argv._[0]

	if cfgFile
		# Convert all paths to be relative to the config file
		gConfig = loadConfig(cfgFile)
		gConfig.port = argv.port or gConfig.server.port or 3000
	else
		# not specify config file
		console.error "Need config file!"
		process.exit(0)

	# start with http server
	launchServer(gConfig)
	launchWatcher(gConfig) if argv.watch


# Load config file and format configs
loadConfig = (fileName)->
	cwd = process.cwd()
	configFile = fedUtil.realPath(cwd, fileName)
	configs = require(configFile)

	serverConfigs = configs.server

	configd = path.dirname(configFile)

	# All paths is relative to the config file
	serverConfigs.path.view = fedUtil.realPath(configd, serverConfigs.path.view)
	serverConfigs.path.mock = fedUtil.realPath(configd, serverConfigs.path.mock)
	serverConfigs.path.public = fedUtil.realPath(configd, serverConfigs.path.public)

	return configs

# Start http server
#	w
launchServer = (gConfig)->

	# Fork process to create and start localServer
	pChild = childProcess.fork(
		path.join(__dirname, "./dispatcher.js"),
		[], {
			silent: true,
			stdio: [process.stdin, process.stdout]
		})

	# Print child_process's output when got error
	pChild.stdout.on("data", (data)->
		# console.log("" + data)
		process.stdout.write(data)
	)
	pChild.stderr.on("data", (data)->
		# Sigin dead to pChild, so it will be killed
		pChild.dead = true
		# console.log("" + data)
		process.stderr.write(data)
	)

	# Create and run local server
	# Send SIG_START_SERVER signal to child process
	pChild.send({
		signal: "SIG_START_SERVER"
		config: gConfig
	})

	# Receive the local server instance from child process that created
	pChild.on("message", (localServerInstance)->
		#!! Cant pass object between processes
		# pChild.localServerInstance = localServerInstance
		return
	)

	return pChild

# Watch file changes, and restart pChild
launchWatcher = (gConfig)->
	# watch mock
	watch
		.add(gConfig.server.path.mock, true)
		.add(gConfig.server.path.view, true)
		.onChange (file, prev, curr, action)->
			console.log '[%s] [%s], restarting...', file, action
			if pChild.dead
				pChild.kill("SIGTERM")
				pChild = null
				launchServer(gConfig)
			else
				pChild.on("exit", -> launchServer(gConfig) )
				pChild.kill("SIGTERM")
				pChild = null
	return
