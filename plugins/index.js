/**
 * Plugins manager
 * @author  ijse
 */
//TODO: Design Plugin System
exports.load = function(pluginName) {
	return require("./" + pluginName);
};