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
// var httpProxy     = require('http-proxy');
var plugin        = require('../../plugins');

var RenderManager = require('./RenderManager');
var RouterManager = require('./RouterManager');

var createServer = function(gConfig) {
    var app = exports.app = new express();

    app.set('proxy support', gConfig.proxy.enable);
    app.set('proxy setting', gConfig.proxy);
    app.set('static resource', gConfig.path['public']);
    app.set('views', gConfig.path.view);
	app.set('view engine', 'ejs');

    // Define renders for response
    // so that it will be used in router
    app.set('render manager', new RenderManager());

    //!!PLUGIN EMIT
    plugin.emit('appinit1', app);

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

    // Static resources
    app.use(express['static'](app.get('static resource')));

    // No router, proxy fail, no static resource, then throw error
    app.use(express.errorHandler());

    // apply global variables
    app.locals(gConfig.globals);

    // load routes
    RouterManager.loadRoutes(gConfig.path.mock, app);

    // Start local-service host, notify address
    var httpServer = http.createServer(app);

    return httpServer;
};

// When receive the signal comes from parent
process.on("message", function(msg) {
    var localServerInstance = null;
    // console.log("Got the message", msg);
    if(msg.signal === "SIG_START_SERVER") {
        localServerInstance = createServer(msg.config).listen(msg.config.port, function() {
            console.log("FED server listening on port " + msg.config.port);
        });
        // Send to parent process
        // process.send(localServerInstance);
    }
});

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


