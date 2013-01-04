exports.watch = function(fed) {

	fed("put /testPost", function(req, res) {
		var p = req.param("name");
		this.render.text(p + ", Hello World!!");
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

	/**
	 * Artical Test
	 * ============
	 *	some description here
	 *
	 * @param test
	 * @return title
	 */
	fed("get /artical/aa", function() {
		this.render.ftl("variables", {
			title: "Test Suit1"
		}, res);
	});

};
