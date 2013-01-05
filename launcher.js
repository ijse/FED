/**
 * FED Launcher
 *
 * @author ijse
 */

var gConfig = require("./globalConfig");

var proxyServer = require("./proxyServer");
var localServer = require("./localServer");
//TODO: Commander...

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