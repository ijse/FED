/**
 * Dispatch command request
 *
 *  1. load modules
 *  2. do some initialize stuffe
 *  3. process command
 */
require("coffee-script");
var Module = require("../modules");

global.Hub = require("hubjs")();

var SIGNALLIST = {
	"SIG_START_SERVER": function(config) {
		// Launch server
		var localServer = require("./localServer");
		localServer.create(config).listen(config.port, function() {
            console.log("FED server listening on port " + config.port);
        });
	}
};

process.on("message", function(msg) {
	if(SIGNALLIST[msg.signal]) {

		// Load modules
		Module(msg.config["plugins"]);

		Hub.emit("modules.load");

		SIGNALLIST[msg.signal](msg.config);
	} else {
		// Signal not found
	}
});