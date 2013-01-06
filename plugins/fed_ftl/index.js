/**
 * interface with expressjs
 *
 * @author : ijse
 */
var path_normalize = require("path").normalize;
var ftlEngine = require("./TemplateRun.js");

//TODO: Add hook when local server initialize
exports.__express = exports.renderFile = function (path, options, fn) {
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