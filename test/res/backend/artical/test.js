module.exports = {
	"get /test": function() {
		/**
		 * Test Title
		 *  some description
		 *
		 * @author ijse
		 * @param name username
		 * @param pass password
		 * @return success|fail
		 */
		this.render.text("hello fed");
	},
	"get /artical/list": function() {
		this.render.ftl("index", {
			"title": "hello",
			"message": "index page",
			"mylist": ["1", "2", "3"]
		});
	}
};