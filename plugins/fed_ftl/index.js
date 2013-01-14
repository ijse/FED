/**
 * interface with expressjs
 *
 * @author : ijse
 */
var path_normalize = require("path").normalize;
var ftlEngine = require("./TemplateRun.js");

// init
// =====
// Bind event to plugin
exports.init = function(configs) {
	// Regist render engine to app
	this.on("appinit1", function(app) {
		app.engine('ftl', renderFile);

		// Add render hook
		app.get("render manager").add("ftl", ftlRender);
	});

};

// Ftl Renderer
// ===========
// @param tpl    - freemarker template name, without .ftl
// @param data   - data model
function ftlRender(res) {
    return function(tpl, data) {
        res.set('Content-Type', 'text/html');
        res.render(tpl + '.ftl', data);
    };
}

//TODO: Add hook when local server initialize
var renderFile = exports.__express = exports.renderFile = function (path, options, fn) {
	var templateName = "";
	var viewsDir = path_normalize(options.settings.views);
	templateName = path.replace(viewsDir, "");
	templateName = templateName.replace(/^(\/|\\)/, "");

	try {
		ftlEngine.processTemplate({
			settings: {
				"encoding": options.settings.fileEncoding || "utf-8",
				"viewFolder": viewsDir
			},
			"fileName": templateName,
			data: options,
			callback: fn
		});
	} catch(err) {
		fn(err);
		throw err;
	}

};