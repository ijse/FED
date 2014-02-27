/**
 * interface with expressjs
 *
 * @author : ijse
 */
var path_normalize = require("path").normalize;
var vmEngine = require("./TemplateRun.js");

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
var renderFile = function (path, options, fn) {
	templateName = "";
	viewPath = path_normalize(options.settings.views);
	templateName = path.replace(viewPath, "");
	templateName = templateName.replace(/^(\/|\\)/, "");
	try {
		vmEngine.processTemplate({
			"viewPath": viewPath,
			"fileName": templateName,
			"dataModel": options,
			"callback": fn
		});
	} catch(err) {
		fn(err);
		throw err;
	}
};

// init
// =====
// Bind event to plugin
exports.init = function(configs) {
	// Regist render engine to app
	Hub.on("localServer.renderEngine.regist", function(param){
		app = param.app;
		app.engine('vm', renderFile);
		// add render hook
		app.get("render manager").add('vm', vmRender)
	})

	return {
		renderFile: renderFile
	}

};