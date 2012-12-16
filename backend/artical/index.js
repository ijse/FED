
exports.watch = function(app, ftlRender, jsonRender) {

	app.get("/artical/list", function(req, res, next) {
		var data = {
			"title": "hello",
			"message": "index page"
		};

		ftlRender(data, "index", res);
		// jsonRender(data, res);
		// res.set("Content-Type", "utf-8");
		// res.render("index", data);
	});
};