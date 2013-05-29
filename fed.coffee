#!/usr/bin/env coffee


Optimist     = require("optimist")

Package      = require("./package.json")
Module       = require("./libs/modules")

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
		.boolean(["version"])
		.alias({
			"version" : "v"
			"help": "h"
		})
		.describe({
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
	# process.exit(0)

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

if argv.help
	CLI.showHelp()
	process.exit(0)

# Show version info
if argv.version
	console.log(Package.version)
	process.exit(0)






