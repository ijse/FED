var fs = require('fs');
var pathSep = require('path').sep;

var Path = require("path");
var directory = module.exports = {};

directory.mkdirSync = function __directory_mkdirSync__(path) {

	var dirs = Path.normalize(path).split(pathSep);
	var root = "";

	while (dirs.length > 0) {
		var dir = dirs.shift();
		if (dir === "") { // If directory starts with a /, the first path will be an empty string.
			root = Path.normalize(pathSep);
		}
		if (!fs.existsSync(root+dir)) {
			fs.mkdirSync(root+dir);
		}
		root += dir + pathSep;
	}
};

module.exports.mkdir = function __directory_mkdir__(path, callback) {
	var dirs = Path.normalize(path).split(pathSep);
	var root = "";

	mkDir();

	function mkDir() {
		var dir = dirs.shift();
		if (dir === "") { // If directory starts with a /, the first path will be an empty string.
			root = Path.normalize(pathSep);
		}
		fs.exists(root + dir, function (exists) {
			if (!exists) {
				fs.mkdir(root + dir, function (err) {
					root += dir + pathSep;
					if (dirs.length > 0) {
						mkDir();
					} else if (callback) {
						callback();
					}
				});
			} else {
				root += dir + pathSep;
				if (dirs.length > 0) {
					mkDir();
				} else if (callback) {
					callback();
				}
			}
		});
	}
};