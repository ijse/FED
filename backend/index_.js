var path = require("path");
var fs = require("fs");
var util = require("util");
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.watch = function(app) {
	// load all routes
	debugger;
	loadRoutes(__dirname, "/", app);

	// app.all("/*", function(req, res, next) {

	// });
};

function loadRoutes(root, basePath, app) {
	var dir = root;
	var list = [];
	list = fs.readdirSync(dir);
	var i = 0;
	var makeHandleFunc = function(routebody) {
		var fn;
		if(typeof routebody === "function") {
			fn = function(req, res, next) {
				routebody.call(routebody,
					function(tpl, data) {
						res.set("Content-Type", "text/html");
						res.render(tpl, data);
					},
					{req: req, res: res, next: next}
				);
			};
		} else {
			fn = function(req, res, next) {
				res.send(routebody);
			};
		}
		return fn;
	};

	for(; i<list.length; i++) {
		var f = path.join(root, list[i]);
		var filename = path.basename(f);
		if((fs.lstatSync(f)).isDirectory()) {
			// if director, recurse
			loadRoutes(f, basePath + "/" + filename, app);
		} else {
			// bind route
			var match_cmd, match_filename;
			var routeObj = require(f);
			var req_method, req_path;
			match_filename = filename.match(/^(?:(.*?)_)?(.*)$/);
			if(util.isArray(routeObj)) {
				match_cmd = routeObj[0].match(/^(?:(.*?)\s)?(.*)$/);
				req_method = match_cmd[1] || match_filename[1] || "get";
				req_path = basePath + (match_cmd[2] || ( "/" + match_filename[2]));
			} else {
				req_method = match_filename[1] || "get";
				req_path = basePath + "/" + match_filename[2];
				routeObj = [null, routeObj];
			}

			var handle_func = makeHandleFunc(routeObj[1]);

			debugger;
			// Add listen
			app[req_method].call(app[req_method], req_path, handle_func);
		}
	}
}