#!/usr/bin/env node
/**
 * FED Launcher
 *
 * @author ijse
 */

var VERSION = require("./package.json").version;
var commander = require("commander");
var watch = require("node-watch");
var path = require("path");
var fedUtil = require("./libs/fedUtil.js");

var plugin = require("./plugins");

// Start plugin system
plugin.init();

// Add commander support
commander.version(VERSION);
		// .addImplicitHelpCommand();

// Help command
commander
	.command('help')
	.option("-c", "the help")
	.description("Show help")
	.action(function(cmd) {
		if(cmd) {
			commander.executeSubCommand([null, ""], ["help", cmd], []);
			// commander[cmd].help();
		} else {
			commander.help();
		}
	});

//!!PLUGIN EMIT
plugin.emit("commandinit", commander);

// Server start
commander
	.command('run')
	.option('-P, --port <n>', 'Local server listen port')
	.option("-p, --proxy", "With proxy support")
	.description("start local-server, or with proxy support")
	.action(function(configFile) {

		// Subcommand handler
		var cmd = arguments[arguments.length - 1];

		// Optimize config
		var gConfig = fedUtil.optimizeConfig(configFile, cmd.port, cmd.proxy);
		var localServer = require("./localServer");

		//!!PLUGIN EMIT
		plugin.emit("runinit", gConfig);

		// Create and run local server
		localServer.create(gConfig).listen(gConfig.port, function () {
			console.log("FED server listening on port " + gConfig.port);
		});
	});

commander.parse(process.argv);
