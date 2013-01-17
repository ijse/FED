
exports.init = function() {

	this.on("appinit1", function() {
		// console.log("hi, ", this);
	});

	this.doSomething = function() {
		console.log("work hard");
	};

	// Default to use exports as the interafce
	// return exports;
};