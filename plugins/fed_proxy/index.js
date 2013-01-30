/**
 * Proxy Server
 * ============
 * Add support of reverse-proxy for local-dev
 *
 * @author : ijse
 */
var httpProxy = require('http-proxy');

var express = require('express');
var path = require('path');
var ProxyInstance = null;

exports.init = function() {

	this.on("runinit", function(gConfig) {
		// Create and run proxy server
		var pSetting = gConfig.proxy;
		if(pSetting.enable) {
			createServer(pSetting).listen(pSetting.port, function() {
				console.log("Proxy Server listening on " + pSetting.port);
			});
		}
	});

	this.on("appinit3", function(app) {

		// Connect re-emit event on request
		require("connect-restreamer");

		config = app.get("proxy setting");
		ProxyInstance = new httpProxy.RoutingProxy();
		app.enable('trust proxy');
		app.use(proxyServerMidleware);
	});

};

// Create proxy server
// ===================
createServer = function(pSetting) {
	// Create proxy server and start listenning port
	var proxyServer = httpProxy.createServer({
		router: pSetting.router
	});
	return proxyServer;
};

// Proxy Server Midleware
// ======================
// if local resource not exist,
// proxy to remote server by configuration
function proxyServerMidleware(req, res, next) {
    // Check if static resource exist
    var sfile = path.join(req.app.get('static resource'), req.path);
    if(path.existsSync(sfile)) {
        return next();
    }
    // Proxy request
    // --------------
    // buffer so that it won't be lost,
    // !!This is confilced with `methodOverride()`
    var buffer = httpProxy.buffer(req);
    var proxySetting = req.app.get('proxy setting');
    // Do process
    ProxyInstance.proxyRequest(req, res, {
        host: proxySetting.remote.host,
        port: proxySetting.remote.port,
        buffer: buffer
    });
}
