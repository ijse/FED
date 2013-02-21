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

	// Watch backend and views, if file change,
	// restart child process to apply the changes
	watch(backendPath, doRestart);
	watch(gConfig.path.views, doRestart);

} else {
	// for other subcommand, just exit after finishing
	// child_process.kill("SIGTERM");
	// process.exit();

	// Wait for child process exit
	child_process.on("exit", function() {
		process.exit();
	});
}

// Restart the process
function doRestart(filename) {
	console.log('[%s] changed, restarting...', filename);
	if(child_process.dead) {
		xxoo();
	} else {
		child_process.on("exit", xxoo);
		child_process.kill("SIGTERM");
	}
}
// Create a child process
function xxoo() {
	child_process = createChild(
		path.join(__dirname, "launcher.js"),
		child_argv, {
			silent: true,
			stdio: [process.stdin, process.stdout]
		});

	// Print child_process's output when got error
	child_process.stdout.on("data", function(data) {
		// console.log("" + data);
		process.stdout.write(data);
	});

	child_process.stderr.on("data", function(data) {
		child_process.dead = true;
		// console.log("" + data);
		process.stderr.write(data);
	});
}