
exports.watch = function(app, ftlRender, jsonRender) {

	//
	app.get("/artical/list", function(req, res, next) {
		ftlRender({
			"title": "hello",
			"message": "index page",
			"mylist": [
				"1", "2", "3"
			]
		}, "index", res);
		// jsonRender(data, res);
	});

	app.get("/artical/aa", function(req, res, next) {
		ftlRender({
			title: "Test Suit1"
		}, "variables", res);
		// jsonRender({"hello": "134"}, res);
	});

};