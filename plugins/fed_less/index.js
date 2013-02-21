var lessMiddleware = require("less-middleware");
var os = require("os");
var express = require("express");

exports.init = function(config) {
	var lessCfg = {
		dest: os.tmpDir(),
		force: true,
		// paths: "",
		// prefix: "",
		optimization: 1,
		debug: true,
		compress: true,
		dumpLineNumbers: "mediaquery"
	};
	//TODO: MERGE lessCfg and config

	this.on("appinit2", function(app) {
		// console.log("-----run less middleware-----");
		lessCfg.src = app.get("static resource");
		app.use(lessMiddleware(lessCfg));
		// app.use(express["static"](lessCfg.dest));
	});
};