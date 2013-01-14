/**
 * Fed Utils sometimes used
 *
 * @author  ijse
 */
var path = require("path");

// Convert Path Object
// ===================
// convert path to normal style.
// @param pathObj ={ item: path, ...}
// @return pathObj
exports.convPath = function(basePath, pathObj) {
	for (var i in pathObj) {
		var p = pathObj[i];
		p = p[0] == "." ? path.join(basePath, p) : path.normalize(p);
		pathObj[i] = p;
	}
	return pathObj;
};