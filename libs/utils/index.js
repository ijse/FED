/**
 * Fed Utils sometimes used
 *
 * @author  ijse
 */
var path = require("path");
var directory = require("./directory.js");

module.exports = {
	mkdirSync: directory.mkdirSync,
	mkdir: directory.mkdir,
	// Convert Path Object
	// ===================
	// convert path to normal style.
	// @param pathObj ={ item: path, ...}
	// @return pathObj
	convPath: function (basePath, pathObj) {
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
	// ./bb.txt ==> {base}\\bb.txt
	// cc.txt ==> {base}\\cc.txt
	realPath: function (base, p) {
		var r = "";
		if (p[1] === ":" || p[0] === "/") {
			r = path.normalize(p);
		} else {
			r = path.join(base, p);
		}
		return r;
	},

	//Object extend comes from jQuery
	extend: function () {
		var options, name, src, copy, copyIsArray, clone, target = arguments[0] || {},
			i = 1,
			length = arguments.length,
			deep = false,
			toString = Object.prototype.toString,
			hasOwn = Object.prototype.hasOwnProperty,
			push = Array.prototype.push,
			slice = Array.prototype.slice,
			trim = String.prototype.trim,
			indexOf = Array.prototype.indexOf,
			class2type = {
				"[object Boolean]": "boolean",
				"[object Number]": "number",
				"[object String]": "string",
				"[object Function]": "function",
				"[object Array]": "array",
				"[object Date]": "date",
				"[object RegExp]": "regexp",
				"[object Object]": "object"
			},
			jQuery = {
				isFunction: function (obj) {
					return jQuery.type(obj) === "function";
				},
				isArray: Array.isArray || function (obj) {
					return jQuery.type(obj) === "array";
				},
				isWindow: function (obj) {
					return obj !== null && obj === obj.window;
				},
				isNumeric: function (obj) {
					return !isNaN(parseFloat(obj)) && isFinite(obj);
				},
				type: function (obj) {
					return obj === null ? String(obj) : class2type[toString.call(obj)] || "object";
				},
				isPlainObject: function (obj) {
					if (!obj || jQuery.type(obj) !== "object" || obj.nodeType) {
						return false;
					}
					try {
						if (obj.constructor && !hasOwn.call(obj, "constructor") && !hasOwn.call(obj.constructor.prototype, "isPrototypeOf")) {
							return false;
						}
					} catch (e) {
						return false;
					}
					var key;
					for (key in obj) {}
					return key === undefined || hasOwn.call(obj, key);
				}
			};
		if (typeof target === "boolean") {
			deep = target;
			target = arguments[1] || {};
			i = 2;
		}
		if (typeof target !== "object" && !jQuery.isFunction(target)) {
			target = {};
		}
		if (length === i) {
			target = this;
			--i;
		}
		for (i; i < length; i++) {
			if ((options = arguments[i]) !== null) {
				for (name in options) {
					src = target[name];
					copy = options[name];
					if (target === copy) {
						continue;
					}
					if (deep && copy && (jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)))) {
						if (copyIsArray) {
							copyIsArray = false;
							clone = src && jQuery.isArray(src) ? src : [];
						} else {
							clone = src && jQuery.isPlainObject(src) ? src : {};
						}
						// WARNING: RECURSION
						target[name] = extend(deep, clone, copy);
					} else if (copy !== undefined) {
						target[name] = copy;
					}
				}
			}
		}
		return target;
	}
};