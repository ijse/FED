/**
 * Router Manager
 *
 * @author  ijse
 */
var coffeescript = require('coffee-script');
var path = require('path');
var fs = require('fs');

exports.loadRoutes = importLogic;

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
            // Only .js and .coffee file will be use
            if (!path.extname(file).match(/(.js|.coffee)/)) {
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
                // Discard cmd start with ~
                if(/^~/.test(cmd)) {
                    continue;
                }
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
    cmd = cmd.split(' ');
    var url = cmd[1] || cmd[0];
    var method = cmd.length < 2 ? 'get' : cmd[0];

    _app[method](url, function(req, res, next) {
        route.call({
            app: _app, req: req, res: res, next: next,
            //TODO:
            render: _app.get('render manager').list(res)
            // Deprecated!
            // render: {
            //     ftl: ftlRender(res),
            //     json: jsonRender(res),
            //     text: textRender(res)
            // }
        }, req, res, next);
    });
}