
exports.init = function() {

	this.on("create", function() {
		console.log("hi, ", this);
	});

	this.doSomething = function() {
		console.log("work hard");
	};

};