/**
 * Proxy Server
 * ============
 * Add support of reverse-proxy for local-dev
 *
 * @author : ijse
 */
var httpProxy = require('http-proxy');

exports.run = function(pSetting) {
	// Create proxy server and start listenning port
	var proxyServer = httpProxy.createServer({
		router: pSetting.router
	}).listen(pSetting.port, function() {
		console.log("Proxy Server listening on " + pSetting.port);
	});

	return proxyServer;
};