
exports.watch = function(app) {
	app.get("/index", function(req, res, next) {

		data = require("./artical/index.json");
		res.set("Content-Type", "utf-8");
		res.render("index", data);
	});
};