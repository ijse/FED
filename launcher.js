/**
 * FED Launcher
 *
 * @author : ijse
 */

var gConfig = require("./globalConfig");

var proxyServer = require("./proxyServer");
var localServer = require("./localServer");
//TODO: Commander...

// Run proxy server
if(gConfig.useProxy) {
	proxyServer.run(gConfig.proxySetting);
}

// Run local server
localServer.run(gConfig);
