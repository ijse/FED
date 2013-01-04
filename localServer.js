/**
 * Local Server
 * ========
 * 1. load configurations and modules
 * 2. configure app
 * 3. Set up proxy if useProxy
 * 4. import backend logic
 * 5. start service
 *
 * @author : ijse
 */
var express       = require('express');
var http          = require('http');
var path          = require("path");
var fs            = require("fs");
var util          = require("util");
var httpProxy     = require('http-proxy');
var app           = express();

// For proxying request to remote server
var ProxyInstance = null;

exports.app = app;
exports.create = function(gConfig) {
    app.set('proxy support', gConfig.useProxy);
    app.set('proxy setting', gConfig.proxySetting);
    app.set('static resource', gConfig.path["public"]);
    app.set('views', gConfig.path.views);
	app.set('view engine', 'fed_ftl');
	app.engine("ftl", require("fed_ftl").__express);
    app.use(express.favicon());

    // Will print every request log
    app.use(express.logger('dev'));

    // `methodOverride()` will only be available when there is no proxy
    if(!gConfig.useProxy) {
        app.use(express.bodyParser());
        app.use(express.methodOverride());
    }

    // Support cookie and session
    app.use(express.cookieParser('ijse'));
    app.use(express.session());

    // Now router
    app.use(app.router);

    // Continue with proxy request
    if(gConfig.useProxy) {
        ProxyInstance = new httpProxy.RoutingProxy();
        app.enable('trust proxy');
        app.use(proxyServerMidleware);
    }

    // Static resources
    app.use(express["static"](app.get("static resource")));

    // No router, proxy fail, no static resource, then throw error
    app.use(express.errorHandler());

    // apply global variables
    app.locals(gConfig.globals);

    // load routes
    importLogic(gConfig.path.backend, app);

    // Start local-service host, notify address
    var httpServer = http.createServer(app);

    return httpServer;
};


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
            // >>with fed();
            // if (obj.watch) {
            //     //
            //     obj.watch(fed(app));
            // }
            for(var cmd in obj) {
                if(obj.hasOwnProperty(cmd)) {
                    applyRoutes(cmd, obj[cmd], app);
                }
            }
        }
    }
}

// Apply Routes
// ============
// @param _app app instance
function applyRoutes(cmd, route, _app) {
    cmd = cmd.split(" ");
    var url = cmd[1] || cmd[0];
    var method = cmd.length < 2 ? "get" : cmd[0];
    _app[method](url, function(req, res, next) {
        route.call({
            app: _app, req: req, res: res, next: next,
            render: {
                ftl: ftlRender(res),
                json: jsonRender(res),
                text: textRender(res)
            }
        }, req, res, next);
    });
}

// Route Entry(deprecated)
// ===========
// @param _app app instance
// @return function(cmd, fn)
function fed(_app) {
    var foo = function(fn, req, res, next) {
        fn.call({
            app: _app, req: req, res: res, next: next,
            render: {
                ftl: ftlRender(res),
                json: jsonRender(res),
                text: textRender(res)
            }
        }, req, res, next);
    };
    //TODO: Support midleware
    return function(cmd, fn) {
        cmd = cmd.split(" ");
        var url = cmd[1] || cmd[0];
        var method = cmd.length < 2 ? "get" : cmd[0];
        _app[method](url, function(req, res, next) {
            //Test:
            //  $>curl -d "name=ijse&_method=put" http://localhost:3000/testput
            //  $>ijse, Hello World!!
            if(_app.get("proxy support")) {
                doBodyParser(_app, req, res, next, function() {
                    foo(fn, req, res, next);
                });
            } else {
                foo(fn, req, res, next);
            }
        });
    };
}

// Support express.bodyParser()
// ======================================
// Parse request body to support POST request params so that
// we can use `req.param()` and `req.body`
function doBodyParser(_app, req, res, next, cb) {
    express.bodyParser().call(_app, req, res, function(err) {
        if(err) return next(err);
        cb();
    });
}


// Proxy Server Midleware
// ======================
// if local resource not exist,
// proxy to remote server by configuration
function proxyServerMidleware(req, res, next) {
    // Check if static resource exist
    var sfile = path.join(app.get("static resource"), req.path);
    if(path.existsSync(sfile)) {
        return next();
    }
    // Proxy request
    // --------------
    // buffer so that it won't be lost,
    // !!This is confilced with `methodOverride()`
    var buffer = httpProxy.buffer(req);
    var proxySetting = app.get("proxy setting");
    // Do process
    ProxyInstance.proxyRequest(req, res, {
        host: proxySetting.remote.host,
        port: proxySetting.remote.port,
        buffer: buffer
    });
}

// Plain Text Render
// =================
// @param data  - text data
function textRender(res) {
    return function(data) {
        res.end(data);
    };
}

// Ftl Renderer
// ===========
// @param tpl    - freemarker template name, without .ftl
// @param data   - data model
function ftlRender(res) {
    return function(tpl, data) {
        res.set("Content-Type", "text/html");
        res.render(tpl + ".ftl", data);
    };
}

// Json Renderer
// =============
// @param data   - data model
function jsonRender(res) {
    return function(data) {
        res.json(data);
    };
}
