/**
 * Plugins manager
 * Life-Circle from begin to end
 *
 * @author  ijse
 */
var coffeescript = require("coffee-script");
var EventEmitter = require("events").EventEmitter;

var PluginManager = Object.create(EventEmitter.prototype);

PluginManager.init = function() {
	var pluginList = require("./config.json");

	if(global.plugins) {
		return ;
	} else {
		global.plugins = {};
	}
	for(var name in pluginList) {
		// plugin configs
		var pluginConfigs = pluginList[name];
		// load plugin instance
		// Every plugin only exports the interface that
		// PluginManager saved
		var plugin, pInterface;
		try {
			// load plugin class
			plugin = require("./" + name);

			// Initalize plugin with configs, and get the instance
			pInterface = plugin.init.call(PluginManager, pluginConfigs);

			// Add to repo
			global.plugins[name] = pInterface || plugin;

			// console.log("Plugin[" + name + "] load success!");
		} catch(e) {
			throw "Plugin " + name + " load fail!";
		}
	}
};

// Return the plugin
PluginManager.require = function(pluginName, opts) {
	return global.plugins[pluginName];
};

// Deprecated!!
PluginManager.load = function(pluginName) {
	console.error("load() Method has been deprecated! Use require() insead!");
	return require("./" + pluginName);
};

// Read all plugins, config them
// if(!global.plugins) {
//	PluginManager.init(pluginConfig);
// }

module.exports = PluginManager;
