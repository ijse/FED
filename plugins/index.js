/**
 * Plugins manager
 * @author  ijse
 */
//TODO: Design Plugin System

var EventEmitter = require("events").EventEmitter;
// var pluginList = require("./config.json");

// hook in app
var hooks = [];

var hook = {
	"local_server_init": {},
	"local_server_before_route": {},
	"local_server_after_route": {}
};

var PluginManager = Object.create(EventEmitter.prototype);

PluginManager.init = function(opts) {
	var pluginList = opts.enablePlugins;
	for(var name in pluginList) {
		// plugin configs
		var pluginObj = pluginList[name];
		// load plugin instance
		var plugin;
		try {
			plugin = require(name);
		} catch(e) {
			throw "错误：" + name + "插件载入异常！";
		}
		// initalize plugin with configs
		var phook = plugin.config(pluginObj);
		// add list
		hooks.push(phook);
	}
	return hooks;
};

// Deprecated!!
PluginManager.load = function(pluginName) {
	return require("./" + pluginName);
};

// Read all plugins, config them
// PluginManager.init();

module.exports = PluginManager;
