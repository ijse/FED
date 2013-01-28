#!/usr/bin/env node
/**
 * FED Launcher
 *
 * @author ijse
 */
//TODO: Auto reload when update codes
//TODO: Deploy to server by ftp/sftp
//TODO: Some more utils: jsCompressor, file utils...
//TODO: Test suits

var VERSION = require("./package.json").version;
var commander = require("commander");
var path = require("path");
var fedUtil = require("./libs/fedUtil.js");

var plugin = require("./plugins");

// Start plugin system
plugin.init();

// Add commander support
commander.version(VERSION);
		// .addImplicitHelpCommand();

// Help command
// commander
// 	.command('help')
// 	.option("-c", "the help")
// 	.description("Show help")
// 	.action(function() {
// 		commander.help();
// 	});

//!!PLUGIN EMIT
plugin.emit("commandinit", commander);

// Server start
commander
	.command('run')
	.option('-P, --port <n>', 'Local server listen port')
	.option("-p, --proxy", "With proxy support")
	.option('-C, --config-file <ConfigFilePath>', 'The config file, "./configs/index.json" as default')
	.description("start local-server, or with proxy support")
	.action(function(cmd) {

		// Must provide config file
		if(!cmd.configFile) {
			console.error("You must provide the config file!!");
			return ;
		}

		// var proxyServer = require("./proxyServer");
		var localServer = require("./localServer");

		// Format config file path
		var realConfigFile = fedUtil.realPath(process.cwd(), cmd.configFile);

		// Inherit config
		var gConfig = require(realConfigFile);
		gConfig.port = cmd.port || gConfig.port;

		gConfig.proxy = gConfig.proxy || {};
		gConfig.proxy.enable = typeof cmd.proxy === "undefined" ? gConfig.proxy.enable : cmd.proxy;

		// Convert path
		gConfig.path = fedUtil.convPath(__dirname, gConfig.path);

		//!!PLUGIN EMIT
		plugin.emit("runinit", gConfig);

		// Create and run local server
		// config > environment > default(3000)
		var localServicePort = gConfig.port || process.env.PORT || 3000;
		localServer.create(gConfig).listen(localServicePort, function () {
			console.log("FED server listening on port " + gConfig.port);
		});
	});

commander.parse(process.argv);



