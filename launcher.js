/**
 * FED Launcher
 *
 * @author ijse
 */
//TODO: Auto reload when update codes
//TODO: Auto generate doc
//TODO: Deploy to server by ftp/sftp
//TODO: Html export
//TODO: Some more utils: jsCompressor, file utils...
//TODO: Plugins support
//TODO: Test suits

//TODO: Use ./config.json as config file

var VERSION = "0.0.3";
var commander = require("commander");
var proxyServer = require("./proxyServer");
var localServer = require("./localServer");

var gConfig = require("./globalConfig");

//TODO: Add commander support


//TODO: Regist plugins, apply configuration, add hooks

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