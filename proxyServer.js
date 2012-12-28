/**
 * Proxy Server
 * ============
 * Add support of reverse-proxy for local-dev
 *
 * @author : ijse
 */
var gConfig = require("./globalConfig.js");
var httpProxy = require('http-proxy');

var pSetting = gConfig.proxySetting;


// Create proxy server and start listenning port
var proxyServer = httpProxy.createServer({
	router: pSetting.router
}).listen(pSetting.port, function() {
	console.log("Proxy Server listening on " + pSetting.port);
});

