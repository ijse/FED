#!/usr/bin/env coffee

path         = require("path")
watch        = require("nodewatch")
fedUtil      = require("./libs/utils")
childProcess = require("child_process")
Optimist     = require("optimist")

Package      = require("./package.json")
Module       = require("./libs/modules")

# localServer process handler
pChild = null

# Initialize modules
cmdMap = Module.initCommand()

# Initialize CLI
CLI = Optimist
		.usage("""
			Usage:
			  > fed [OPTIONS] <CONFIG_FILE>
			  > fed <SUBCOMMAND> [OPTIONS]
			\nSubCommand:
			  #{Object.keys(cmdMap)}
		""")
		.boolean(["version", "watch", "server"])
		.alias({
			"server" : "s"
			"port" : "p"
			"watch" : "w"
			"version" : "v"
			"help": "h"
		})
		.describe({
			"server": "Start http server"
			"port": "Specify http server port"
			"watch": "Restart http server when files changes"
			"help": "Show this message"
			"version": "Show current version info"
		})

argv = CLI.argv


# Handle command defined in modules
cmd = cmdMap[argv._[0]]

if cmd
	cmdArgs = Optimist.options(cmd.options).argv
	cmdArgs.$0 += " " + cmdArgs._[0]
	cmdArgs._.shift()
	cmd.fn.call(null, cmdArgs, cmd)
	process.exit(0)

# Show help message
if argv._[0] is "help"
	if not argv._[1]
		# if just help
		CLI.showHelp()
	else
		# if help xxx
		cmd = cmdMap[argv._[1]]

		if cmd
			cmdCli = Optimist([])
				.usage("""
					Usage:
					  > fed #{cmd.name} [OPTIONS]
				""")
				.options(cmd.options)
				.showHelp()
		else
			CLI.showHelp()

	process.exit(0)

if argv.help
	CLI.showHelp()
	process.exit(0)

# Show version info
if argv.version
	console.log(Package.version)
	process.exit(0)

# Format configs
cfgFile = argv._[0]

if cfgFile
	gConfig = fedUtil.optimizeConfig(cfgFile)
	gConfig.port = argv.port or gConfig.port or 3000
else
	# not specify config file
	console.error "Need config file!" if argv.server or argv.watch
	process.exit(0)

# Start http server
#	w
launchServer = ()->
	# Fork process to create and start localServer
	pChild = childProcess.fork(
		path.join(__dirname, "./libs/core/dispatcher.js"),
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
		#!! Cant pass object between processes
		# pChild.localServerInstance = localServerInstance
		return
	)

	return pChild

# Watch file changes, and restart pChild
launchWatcher = ->
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
