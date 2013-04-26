#!/usr/bin/env node

path        = require("path");
watch       = require("nodewatch");
commander   = require("commander");
fedUtil     = require("./libs/fedUtil.js");
childProcess = require("child_process");

# localServer process handler
pChild = null

argv = require("optimist")
		.usage('Usage: $0 [options] [CONFIG_FILE]')
		.boolean("server")
		.alias({
			"s": "server"
			"p": "port"
			"w": "watch"
		})
		.default({})
		.argv

# Format configs
cfgFile = argv._[0]

if cfgFile
	gConfig = fedUtil.optimizeConfig(cfgFile)
	gConfig.port = argv.port or gConfig.port or 3000
else
	# didn't specify config file


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
		# console.log("" + data)
		process.stderr.write(data)
	)

	# Create and run local server
	# Send SIG_START_SERVER signal to child process
	pChild.send({
		sigal: "SIG_START_SERVER",
		config: gConfig
	})

	return pChild


# start with http server
# launchServer() if argv.server
# launchWatcher() if argv.watch
