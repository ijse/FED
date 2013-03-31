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
	},
	"get /tss": function(req, res) {
		this.render.ftl("folder/aa", {});
	},
	"post /post": function(req, res) {
		this.render.text("hello fed");
	},
	"post /post-with-param": function(req, res) {
		this.render.text("hello, " + req.body.name);
	},
	"get (/.*\\.do$)": function(req, res) {
		this.render.text("ok");
	}

};