/**
 * interface with expressjs
 *
 * @author : ijse
 */
var path_normalize = require("path").normalize;
var vmEngine = require("./TemplateRun.js");

// init
// =====
// Bind event to plugin
exports.init = function(configs) {
	// Regist render engine to app
	this.on("appinit1", function(app) {
		app.engine('vm', renderFile);

		// Add render hook
		app.get("render manager").add("vm", vmRender);
	});

};

// vm Renderer
// ===========
// @param tpl    - freemarker template name, without .vm
// @param data   - data model
function vmRender(res) {
    return function(tpl, data) {
        res.set('Content-Type', 'text/html');
        res.render(tpl + '.vm', data);
    };
}

//TODO: Add hook when local server initialize
var renderFile = exports.__express = exports.renderFile = function (path, viewName, dataModel, fn) {
	var viewPath = path_normalize(path);

	try {
		vmEngine.processTemplate({
			"viewPath": viewPath,
			"fileName": viewName,
			"dataModel": dataModel,
			"callback": fn
		});
	} catch(err) {
		fn(err);
		throw err;
	}

};