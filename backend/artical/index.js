
exports.watch = function(app, ftlRender, jsonRender) {
	//
	app.get("/artical/list", function(req, res, next) {
		ftlRender("index",{
			"title": "hello",
			"message": "index page",
			"mylist": [
				"1", "2", "3"
			]
		}, res);
		// jsonRender(data, res);
	});

	app.get("/artical/aa", function(req, res, next) {
		ftlRender("variables", {
			title: "Test Suit1"
		}, res);
		// jsonRender({"hello": "134"}, res);
	});

};