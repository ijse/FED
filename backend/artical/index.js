
exports.watch = function(app, ftlRender, jsonRender) {

	app.get("/artical/list", function(req, res, next) {
		var data = {
			"title": "hello",
			"message": "index page",
			"mylist": [
				"1", "2", "3"
			]
		};

		ftlRender(data, "index", res);
		// jsonRender(data, res);
	});



};