/**
 * Fed Utils sometimes used
 *
 * @author  ijse
 */
var path = require("path");

module.exports = {
	// Convert Path Object
	// ===================
	// convert path to normal style.
	// @param pathObj ={ item: path, ...}
	// @return pathObj
	convPath: function(basePath, pathObj) {
		for (var i in pathObj) {
			var p = pathObj[i];
			// p = p[0] == "." ? path.join(basePath, p) : path.normalize(p);
			p = this.realPath(basePath, p);
			pathObj[i] = p;
		}
		return pathObj;
	},

	// Format the path
	// ===============
	// d:/aaa.txt ==> d:\\aaa.txt
	// ./bb.txt ==> {curPath}\\bb.txt
	// cc.txt ==> {curPath}\\cc.txt
	realPath: function(base, p) {
		var r = "";
		if(p[1] === ":" || p[0] === "/") {
			r = path.normalize(p);
		} else {
			r = path.join(base, p);
		}
		return r;
	},

	//=====
	optimizeConfig: function(configFile, port, withProxy) {
		// Must provide config file
		if(!configFile) {
			console.error("You must provide the config file!!");
			return ;
		}

		// Format config file path
		var realConfigFile = this.realPath(process.cwd(), configFile);
		var configFileFolder = path.dirname(realConfigFile);

		// Inherit config
		var gConfig = require(realConfigFile);

		// argument, config-file, environment-variable, default(3000)
		gConfig.port = port || gConfig.port || process.env.PORT || 3000;

		gConfig.proxy = gConfig.proxy || {};
		gConfig.proxy.enable = typeof withProxy === "undefined" ? gConfig.proxy.enable : withProxy;

		// Convert path
		gConfig.path = this.convPath(configFileFolder, gConfig.path);

		return gConfig;
	}
};

