var lessMiddleware = require("less-middleware");
var os = require("os");
var express = require("express");
var path = require("path");

exports.init = function(config) {
	var lessCfg = {
		dest: config.dest,
		force: config.force || {},
		useTmpDir: config.useTmpDir || false,
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
			lessCfg.dest = path.join(os.tmpDir(), "tmp_fed_less");
		} else if(!lessCfg.dest) {
			lessCfg.dest = lessCfg.src;
		}
		app.use(lessMiddleware(lessCfg));
		if(lessCfg.useTmpDir) {
			app.use(express["static"](lessCfg.dest));
		}
	});
};