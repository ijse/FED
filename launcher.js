#!/usr/bin/env node
/**
 * FED Launcher
 *
 * @author ijse
 */
//TODO: Auto reload when update codes
//TODO: Deploy to server by ftp/sftp
//TODO: Html export
//TODO: Some more utils: jsCompressor, file utils...
//TODO: Plugins support
//TODO: Test suits

var VERSION = require("./package.json").version;
var commander = require("commander");
var path = require("path");

var proxyServer = require("./proxyServer");
var localServer = require("./localServer");
var plugin = require("./plugins");

var gConfig = require("./configs/index.json");

// Start plugin system
plugin.init(gConfig.plugin);


// Add commander support
commander
	.version(VERSION)
	.option('-P, --port <n>', 'Local server listen port')
	.option('-C, --config-file <ConfigFilePath>', 'The config file, "./config.json" as default', "./config.json")
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

commander.parse(process.argv);


// Inherit config
var gConfig = require(commander.configFile);
gConfig.port = commander.port || gConfig.port;
gConfig.proxy.enable = typeof commander.useProxy === "undefined" ? gConfig.proxy.enable : !!commander.useProxy;


// Convert path
gConfig.path = convPath(gConfig.path);


//!!PLUGIN EMIT
plugin.emit("commandinit", commander);


// Create and run proxy server
if(gConfig.proxy.enable) {
	var pSetting = gConfig.proxySetting;
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

// Convert Path Object
// ===================
// convert path to normal style.
// @param pathObj ={ item: path, ...}
// @return pathObj
function convPath(pathObj) {
	for(var i in pathObj) {
		var p = pathObj[i];
		p = p[0] == "." ? path.join(__dirname, p) : path.normalize(p);
		pathObj[i] = p;
	}
	return pathObj;
}