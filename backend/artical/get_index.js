module.exports = ["get /index", function(render, opts) {
	var dataObj = {
		message: "hi~~~~~@##@#$@%"
	}
	render("test", dataObj);
}];
