module.exports = {
	"get /testssssss": function() {
		/**
		 * Test Title
		 *  some description
		 *
		 * @author ijse
		 * @async true
		 * @abcdfeg adkjf aeirjwi woef ofasdkf jhkasldjf klasjdkfl ask
		 * @param name username
		 * @param pass password
		 * @return success|fail
		 */
		this.render.text("hello fed");
	},
	"get /artical/listfffffff": function() {
		/**
		 * Test Title2
		 * some description
		 * @author  ijse
		 * @async false
		 */
		this.render.ftl("index", {
			"title": "hello",
			"message": "index page",
			"mylist": ["1", "2", "3"]
		});
	}
};