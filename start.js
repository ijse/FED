/**
 * Fed Init
 * ========
 * 1. load configurations and modules
 * 2. configure app
 * 3. import backend logic
 * 4. start service
 *
 * @author : ijse
 */
var gConfig = require("./globalConfig.js");

var express = require('express');
var http    = require('http');
var path    = require("path");
var fs      = require("fs");
var util    = require("util");

var app     = express();

app.configure(function () {
    app.set('port', gConfig.port || process.env.PORT || 3000);
    app.set('views', gConfig.path.views);
    app.set('view engine', 'ftl');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser('ijse'));
    app.use(express.session());
    app.use(app.router);

    // app.use(express.static(gConfig.path.public));
    app.use(express["static"](gConfig.path["public"]));
});

app.configure('development', function () {
    app.use(express.errorHandler());
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
        if ((fs.lstatSync(file)).isDirectory()) {
            importLogic(file, app);
        } else {
            // Only .js file
            if (path.extname(file) !== ".js") {
                continue;
            }
            obj = require(file);
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

http.createServer(app).listen(app.get('port'), function () {
    console.log("FED server listening on port " + app.get('port'));
});