/**
 * Plugins manager
 * @author  ijse
 */

exports.load = function(pluginName) {
	return require("./" + pluginName);
};