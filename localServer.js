/**
 * Fed Init
 * ========
 * 1. load configurations and modules
 * 2. configure app
 * 3. import backend logic
 * 4. Set up proxy
 * 5. start service
 *
 * @author : ijse
 */
var gConfig       = require("./globalConfig.js");

var express       = require('express');
var http          = require('http');
var path          = require("path");
var fs            = require("fs");
var util          = require("util");
var httpProxy     = require('http-proxy');
var app           = express();

// For proxying request to remote server
var ProxyInstance = new httpProxy.RoutingProxy();

app.configure(function () {
    // config > environment > default(3000)
    app.set('port', gConfig.port || process.env.PORT || 3000);
    app.set('views', gConfig.path.views);
    app.set('view engine', 'ftl');
    app.use(express.favicon());

    // Will print every request log
    app.use(express.logger('dev'));
	// bodyParser() will cause http-proxy 
	// dealing POST request wrongly 
    app.use(express.bodyParser());
    app.use(express.methodOverride());

    // Support cookie and session
    app.use(express.cookieParser('ijse'));
    app.use(express.session());

    app.use(app.router);

    // app.use(express.static(gConfig.path.public));
    app.use(express["static"](gConfig.path["public"]));

    app.use(express.errorHandler());

    // continue with proxy request
    if(gConfig.useProxy) {
        app.enable('trust proxy');
        app.all("*", proxyServerMidleware);
        // app.use(proxyServerMidleware);
    }

});

// apply global variables
app.locals(gConfig.globals);

// load routes
importLogic(gConfig.path.backend, app);

// Import backend logic
// ====================
// @param root  - backend base path
// @param app   - application object
function importLogic(root, app) {
    var list = fs.readdirSync(root);
    var i = 0, file, obj;
    for(;i < list.length; i++) {
        file = path.join(root, list[i]);
        // All sub directories
        if ((fs.lstatSync(file)).isDirectory()) {
            importLogic(file, app);
        } else {
            // Only .js file will be use
            if (path.extname(file) !== ".js") {
                continue;
            }
            obj = require(file);
            // Call .watch() if exist, with app and renders
            if (obj.watch) {
                obj.watch(app, ftlRender, jsonRender);
            }
        }
    }
}

// Ftl Renderer
// ===========
// @param tpl    - freemarker template name, without .ftl
// @param data   - data model
// @param res    - response object
function ftlRender(tpl, data, res) {
    console.log(tpl, data);
    res.set("Content-Type", "text/html");
    res.render(tpl, data);
}

// Json Renderer
// =============
// @param data   - data model
// @param res    - response object
function jsonRender(data, res) {
    res.json(data);
}

// Proxy Server Midleware
// ======================
// if local resource not exist,
// proxy to remote server by configuration
function proxyServerMidleware(req, res, next) {
    // Proxy request
    // --------------
    // buffer so that it won't be lost
    var buffer = httpProxy.buffer(req);
    // Do process
    ProxyInstance.proxyRequest(req, res, {
        host: gConfig.proxySetting.remote.host,
        port: gConfig.proxySetting.remote.port,
        buffer: buffer
    });
}

// Start local-service host, notify address
http.createServer(app).listen(app.get('port'), function () {
    console.log("FED server listening on port " + app.get('port'));
});

// Export app, for other usages
module.exports = app;
