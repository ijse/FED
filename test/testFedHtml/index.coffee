
fedhtml = require "../../libs/modules/fedHtml"

describe "libs/modules/fedHtml", ->
	it "Parse ejs to htmls by config.json", ()->
		fedhtml.exec {
			configFile: __dirname + "/res/config.coffee"
		}