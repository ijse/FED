module.exports = {
	"get /test": function() {
		/**
		 * dfsdfsd
		 * adfadfadf
		 */
		this.render.text("hello fed");
	},
	"post /post": function() {
		this.render.text("hello fed");
	},
	"post /post-with-param": function(req, res, next) {
		this.render.text("hello, " + req.param("name"));
	},

	"get /testOverride": function() {
		this.render.ftl("child", {});
	}
};