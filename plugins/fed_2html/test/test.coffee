
should = require("chai").should()

fed2html = require "../index"

describe "Fed_2html", ->
	it "处理简单EJS模板文件", (done)->
		opts = fed2html.resolveConfig "./config.json"
		fed2html.doParse opts, (a,b)->
			done(a)
