#!/usr/bin/env node

path        = require("path");
watch       = require("nodewatch");
commander   = require("commander");
fedUtil     = require("./libs/utils/fedUtil.js");
childProcess = require("child_process");

# localServer process handler
pChild = null

commander = require("optimist")
		.usage('Usage: $0 [options] [CONFIG_FILE]')
		.boolean(["server", "watch"])
		.string("port")
		.alias({
			"s": "server"
			"p": "port"
			"w": "watch"
		})
		.describe({
			"server": "Start http-server"
			"port": "Specify http-server port"
			"watch": "Watch file changes, auto restart http-server"
		})
		# .default({})

argv = commander.argv

#TODO: show help message
if argv.help
	commander.showHelp()
	process.exit(0)


# Format configs
cfgFile = argv._[0]

if cfgFile
	gConfig = fedUtil.optimizeConfig(cfgFile)
	gConfig.port = argv.port or gConfig.port or 3000
else
	# not specify config file


# Start http server
#	w
launchServer = ()->
	# Fork process to create and start localServer
	pChild = childProcess.fork(
		path.join(__dirname, "./libs/core/localServer.js"),
		null, {
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
		# pChild.localServerInstance = localServerInstance
		return
	)

	return pChild

# Watch file changes, and restart pChild
launchWatcher = ->
	console.log(gConfig.path);
	# watch mock
	watch
		.add(gConfig.path.mock, true)
		.add(gConfig.path.view, true)
		.onChange (file,prev,curr,action)->
			console.log '[%s] [%s], restarting...', file, action
			if pChild.dead
				pChild.kill("SIGTERM")
				pChild = null
				launchServer()
			else
				pChild.on("exit", launchServer)
				pChild.kill("SIGTERM")
				pChild = null
	return

# start with http server
launchServer() if argv.server
launchWatcher() if argv.watch
