
exports.watch = function(fed) {
	fed("get /test", function(req, res, next) {
		this.render.text("hello fed");
	});

	fed("post /post", function(req, res, next) {
		this.render.text("hello fed");
	});

	fed("post /post-with-param", function(req, res, next) {
		this.render.text("hello, " + req.param("name"));
	});
};

module.exports = {
	"get /test": function() {
		/**
		 * dfsdfsd
		 * adfadfadf
		 */
		this.render.text("hello fed");
	}
};