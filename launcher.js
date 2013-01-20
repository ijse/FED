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

var proxyServer = require("./proxyServer");
var localServer = require("./localServer");
var plugin = require("./plugins");

// Start plugin system
plugin.init();

// Add commander support
commander
	.version(VERSION)
	.option('-P, --port <n>', 'Local server listen port')
	.option('-C, --config-file <ConfigFilePath>', 'The config file, "./configs/index.json" as default', "./configs/index.json")
	.option('--useProxy', 'Use reverse proxy server');

// Help command
commander
	.command('help')
	.option("-c", "the help")
	.description("Show help")
	.action(function() {
		commander.help();
	});

//!!PLUGIN EMIT
plugin.emit("commandinit", commander);

// Server start
commander
	.command('run')
	.option("-p, --proxy", "With proxy support")
	.description("start local-server, or with proxy support")
	.action(function(cmd) {
		// Inherit config
		var gConfig = require(commander.configFile);
		gConfig.port = commander.port || gConfig.port;
		gConfig.proxy.enable = typeof commander.useProxy === "undefined" ? gConfig.proxy.enable : !!commander.useProxy;

		// Convert path
		gConfig.path = fedUtil.convPath(__dirname, gConfig.path);


		//!!PLUGIN EMIT
		plugin.emit("commandinit", commander);

		// Create and run proxy server
		if(gConfig.proxy.enable) {
			var pSetting = gConfig.proxy;
			proxyServer.create(pSetting).listen(pSetting.port, function() {
				console.log("Proxy Server listening on " + pSetting.port);
			});
		}

		// Create and run local server
		// config > environment > default(3000)
		var localServicePort = gConfig.port || process.env.PORT || 3000;
		localServer.create(gConfig).listen(localServicePort, function () {
			console.log("FED server listening on port " + gConfig.port);
		});
	});


commander.parse(process.argv);



