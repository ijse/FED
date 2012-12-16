var path = require("path");
var fs = require("fs");
var util = require("util");

exports.initWith = function(app) {
	// import all logic file
	importLogic(__dirname, app);
};

//
function importLogic(root, app) {
	var list = fs.readdirSync(root);
	var i;
	for(i=0; i<list.length; i++) {
		var file = path.join(root, list[i]);
		if((fs.lstatSync(file)).isDirectory()) {
			importLogic(file, app);
		} else {
			// Only .js file
			if(path.extname(file) !== ".js") {
				continue;
			}
			var obj = require(file);
			if(obj.watch) {
				obj.watch(app, ftlRender, jsonRender);
			}
		}
	}
}

// return ftl
function ftlRender(data, tpl, res) {
	res.set("Content-Type", "text/html");
	res.render(tpl, data);
}

// return json
function jsonRender(data, res) {
	res.json(data);
}