var lessMiddleware = require("less-middleware");
var os = require("os");
var express = require("express");

exports.init = function(config) {
	var lessCfg = {
		dest: config.dest,
		force: config.force || {},
		// paths: "",
		// prefix: "",
		optimization: config.optimization || 1,
		debug: config.debug || true,
		compress: config.compress || false,
		dumpLineNumbers: config.dumpLineNumbers || "mediaquery"
	};

	//TODO: MERGE lessCfg and config

	this.on("appinit2", function(app) {
		// console.log("-----run less middleware-----");
		lessCfg.src = app.get("static resource");
		if(config.useTmpDir) {
			lessCfg.dest = os.tmpDir();
		} else if(!lessCfg.dest) {
			lessCfg.dest = lessCfg.src;
		}
		app.use(lessMiddleware(lessCfg));
		if(lessCfg.useTmpDir) {
			app.use(express["static"](os.tmpDir()));
		}
	});
};