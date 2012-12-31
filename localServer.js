/**
 * Local Server
 * ========
 * 1. load configurations and modules
 * 2. configure app
 * 3. import backend logic
 * 4. Set up proxy if useProxy
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

exports.run = function(gConfig) {
    // config > environment > default(3000)
    app.set('port', gConfig.port || process.env.PORT || 3000);
    app.set('views', gConfig.path.views);
    app.set('view engine', 'ftl');
    app.use(express.favicon());

    // Will print every request log
    app.use(express.logger('dev'));
    // bodyParser() will cause http-proxy
    // dealing POST request wrongly
    // app.use(express.bodyParser());
    app.use(express.methodOverride());

    // Support cookie and session
    app.use(express.cookieParser('ijse'));
    app.use(express.session());

    app.use(app.router);

    // continue with proxy request
    if(gConfig.useProxy) {
        proxyInstance = new httpProxy.RoutingProxy();
        app.enable('trust proxy');
        app.use(proxyServerMidleware);
    }

    // app.use(express.static(gConfig.path.public));
    app.use(express["static"](gConfig.path["public"]));

    app.use(express.errorHandler());

    // apply global variables
    app.locals(gConfig.globals);

    // load routes
    importLogic(gConfig.path.backend, app);

    // Start local-service host, notify address
    var httpServer = http.createServer(app).listen(app.get('port'), function () {
        console.log("FED server listening on port " + app.get('port'));
    });

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
            if (obj.watch) {
                //
                obj.watch(fed(app));
            }
        }
    }
}

// Route Entry
// ===========
// @param _app app instance
// @return function(cmd, fn)
function fed(_app) {
    //TODO: Support midleware
    return function(cmd, fn) {
        cmd = cmd.split(" ");
        var url = cmd[1] || cmd[0];
        var method = cmd.length < 2 ? "get" : cmd[0];

        _app[method](url, function(req, res, next) {
            //Parse request body to support POST request params
            express.bodyParser().call(_app, req, res, function(err) {
                if(err) {
                    return next(err);
                }
                fn.call({
                    app: _app, req: req, res: res, next: next,
                    render: {
                        ftl: ftlRender(res),
                        json: jsonRender(res),
                        text: textRender(res)
                    }
                });
            });
        });
    };

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
        res.render(tpl, data);
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
