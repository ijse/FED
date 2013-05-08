/**
 * Connect to JAR
 *
 * @author :ijse
 */
var spawn = require('child_process').spawn;
var iconv = require("iconv-lite");
var path = require("path");

var jarFile = path.join(__dirname, "/FMtoll-0.5.jar");
//
// args:
//	data - data model
//	settings - include `encoding` and `viewFolder`
//	fileName - template file name
exports.processTemplate = function(args) {
	var dataModel = JSON.stringify(args.data);
	var settings = JSON.stringify(args.settings);
	var resultData = "";

	var cmd = spawn('java', ["-jar", jarFile,
			settings,
			args.fileName,
			dataModel ]);


	if(args.callback) {
		cmd.stdout.on("data", function(data) {
			// args.callback(null, iconv.decode(data, 'gbk'));
			resultData += iconv.decode(data, 'gbk');
		});
		cmd.stderr.on("data", function(data) {
			// Print error message
			console.log(iconv.decode(data, 'gbk'));
		});
		cmd.stdout.on("end", function() {
			args.callback(null, resultData);
		});
	}
};
