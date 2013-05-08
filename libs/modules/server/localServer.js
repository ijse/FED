/**
 * Local Server
 * ========
 * 1. load configurations and modules
 * 2. configure app
 * 3. import backend logic
 * 4. create server
 *
 * @author ijse
 */
var express       = require('express');
var http          = require('http');
var path          = require('path');

var RenderManager = require('./RenderManager');
var RouterManager = require('./RouterManager');

var createServer = function(gConfig) {
    var serverConfigs = gConfig.server;
    var app = exports.app = new express();

    // app.set('proxy support', gConfig.proxy.enable);
    // app.set('proxy setting', gConfig.proxy);
    app.set('static resource', serverConfigs.path['public']);
    app.set('views', serverConfigs.path.view);
	app.set('view engine', 'ejs');

    // Define renders for response
    // so that it will be used in router
    app.set('render manager', new RenderManager());

    //!! EMIT
    Hub.emit("localServer.renderEngine.regist", { app: app });

    app.use(express.favicon());

    // Will print every request log
    app.use(express.logger('dev'));

    app.use(express.bodyParser());
    app.use(express.methodOverride());

    // Support cookie and session
    app.use(express.cookieParser('ijse'));
    app.use(express.session());

    //!! EMIT
    Hub.emit("localServer.loadRoute.before", { app: app });

    // Now router
    app.use(app.router);

    //!! EMIT
    Hub.emit("localServer.loadRoute.after", { app: app });

    // Static resources
    app.use(express['static'](app.get('static resource')));

    // No router, proxy fail, no static resource, then throw error
    app.use(express.errorHandler());

    // apply global variables
    app.locals(serverConfigs.globals);

    // load routes
    RouterManager.loadRoutes(serverConfigs.path.mock, app);

    // Start local-service host, notify address
    var httpServer = http.createServer(app);

    return httpServer;
};

exports.create = createServer;

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


