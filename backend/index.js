var gConfig       = require("../globalConfig.js");
var httpProxy     = require('http-proxy');
var ProxyInstance = new httpProxy.RoutingProxy();

exports.watch = function (app, ftlRender, jsonRender) {
	app.get("/card/index", function (req, res, next) {
		console.log("=-=-=-==-=-=-=-=-=-=-=-=-=");
		ProxyInstance.proxyRequest(req, res, {
			host: gConfig.proxySetting.remote.host,
			port: gConfig.proxySetting.remote.port
		});
	});
};