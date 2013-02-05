/**
 * Local Server
 * ========
 * 1. load configurations and modules
 * 2. configure app
 * 3. Set up proxy if useProxy
 * 4. import backend logic
 * 5. create server
 *
 * @author ijse
 */
var express       = require('express');
var http          = require('http');
var path          = require('path');
// var httpProxy     = require('http-proxy');
var plugin        = require('./plugins');

var RenderManager = require('./libs/RenderManager.js');
var RouterManager = require('./libs/RouterManager.js');

exports.create = function(gConfig) {
    var app = exports.app = new express();

    app.set('proxy support', gConfig.proxy.enable);
    app.set('proxy setting', gConfig.proxy);
    app.set('static resource', gConfig.path['public']);
    app.set('views', gConfig.path.views);
	app.set('view engine', 'ejs');

    // Define renders for response
    // so that it will be used in router
    app.set('render manager', new RenderManager());

    //!!PLUGIN EMIT
    plugin.emit('appinit1', app);

    // Depreacted: old style, use plugin instead
    // app.engine('ftl', plugin.load('fed_ftl').__express);

    app.use(express.favicon());

    // Will print every request log
    app.use(express.logger('dev'));

    app.use(express.bodyParser());
    app.use(express.methodOverride());

    // Support cookie and session
    app.use(express.cookieParser('ijse'));
    app.use(express.session());

    //!!PLUGIN EMIT
    plugin.emit('appinit2', app);

    // Now router
    app.use(app.router);

    //!!PLUGIN EMIT
    plugin.emit('appinit3', app);

    // Continue with proxy request
    // if(gConfig.proxy.enable) {
    //     ProxyInstance = new httpProxy.RoutingProxy();
    //     app.enable('trust proxy');
    //     app.use(proxyServerMidleware);
    // }

    //!!PLUGIN EMIT
    plugin.emit('appinit4', app);

    // Static resources
    app.use(express['static'](app.get('static resource')));

    // No router, proxy fail, no static resource, then throw error
    app.use(express.errorHandler());

    // apply global variables
    app.locals(gConfig.globals);

    // load routes
    RouterManager.loadRoutes(gConfig.path.backend, app);

    // Start local-service host, notify address
    var httpServer = http.createServer(app);

    return httpServer;
};



// Support express.bodyParser()
// ======================================
// Parse request body to support POST request params so that
// we can use `req.param()` and `req.body`
// function doBodyParser(_app, req, res, next, cb) {
//     express.bodyParser().call(_app, req, res, function(err) {
//         if(err) return next(err);
//         cb();
//     });
// }


