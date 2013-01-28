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

// Format the path
// ===============
// d:/aaa.txt ==> d:\\aaa.txt
// ./bb.txt ==> {curPath}\\bb.txt
// cc.txt ==> {curPath}\\cc.txt
exports.realPath = function(base, p) {
	var r = "";
	if(p[1] === ":" || p[0] === "/") {
		r = path.normalize(p);
	} else {
		r = path.join(base, p);
	}
	return r;
};