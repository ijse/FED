module.exports = {
	"get /testejs": function (req, res) {
		res.render("testTree.ejs", {
			"testEjs": "hello ejs",
			"data": [{
				title: "aaaa",
				leaf: false,
				files: [{
					title: "bbbb",
					leaf: false,
					files: [{
						title: "bbb",
						leaf: true
					}, {
						title: "func",
						leaf: true
					}]
				}]
			}]
		});
	}
};