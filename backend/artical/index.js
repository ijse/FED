exports.watch = function(fed) {

	fed("get /bbs", function() {
		this.render.text("Hello World!!```");
	});

	// List Articals
	// ===============
	// some description here ...
	// @author ijse
	// @param page load the pageNumber
	// @param type the artical type
	// @return title, message, list=[]
	fed("get /artical/list", function() {
		this.render.ftl("index", {
			"title": "hello",
			"message": "index page",
			"mylist": ["1", "2", "3"]
		});
	});

	fed("get /artical/aa", function() {
		this.render.ftl("variables", {
			title: "Test Suit1"
		}, res);
	});

};