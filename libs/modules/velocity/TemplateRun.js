/**
 * Connect to JAR
 *
 * @author :ijse
 */
var spawn = require('child_process').spawn;
var iconv = require("iconv-lite");
var path = require("path");

var jarFile = path.join(__dirname, "/VMtoll_fat.jar");
//
// args:
//	dataModel - data model
//	viewPath - template file dirname
//	fileName - template file name
exports.processTemplate = function(args) {
	var dataModel = JSON.stringify(args.dataModel);
	var resultData = "";
	var cmd = spawn('java', ["-jar", jarFile,
			args.viewPath,
			args.fileName,
			dataModel]);

	if(args.callback) {
		// cmd.stdout.setEncoding('utf-8')
		cmd.stdout.on("data", function(data) {
			// args.callback(null, iconv.decode(data, 'gbk'));
			resultData += iconv.decode(data, 'gbk');
		});
		cmd.stderr.on("data", function(data) {
			// Print error message
			console.log(iconv.decode(data, 'gbk'));
		});
		cmd.stdout.on("end", function() {
			// console.log(resultData)
			args.callback(null, resultData);
		});
	}
};
