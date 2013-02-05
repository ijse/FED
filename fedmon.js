#!/usr/bin/env node
/**
 * Watch backend file changes,
 *   Restart process
 *
 * @author ijse
 */
var path = require("path");
var watch = require("node-watch");
var commander = require("commander");
var fedUtil = require("./libs/fedUtil.js");
var createChild = require("child_process").fork;

var child_process, child_argv;

// Only care about this argument
// commander.option('-C, --config-file <ConfigFilePath>');
commander.parse(process.argv);

// Remove first two args
child_argv = process.argv.slice(2);
xxoo();

// Just for `run` subcommand, watch backend file changes
if(child_argv[0] === "run") {
	if(!child_argv[1]) {
		console.error("Need the config file!");
		process.exit();
	}

	// Get the backend path
	var gConfig = fedUtil.optimizeConfig(child_argv[1]);
	var backendPath = gConfig.path.backend;

	// Watch backend path, if file change,
	// restart child process to apply the changes
	watch(backendPath, function(filename) {
		console.log(filename, ' changed, restarting...');
		child_process.on("exit", xxoo);
		child_process.kill("SIGTERM");
	});

} else {
	// for other subcommand, just exit after finishing
	// child_process.kill("SIGTERM");
	// process.exit();

	// Wait for child process exit
	child_process.on("exit", function() {
		process.exit();
	});
}

// Create a child process
function xxoo() {
	child_process = createChild(
		path.join(__dirname, "launcher.js"),
		child_argv);
}