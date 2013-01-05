###
#	Test fed_doc
#	@author: ijse
###

should = require("chai").should()
fedDoc = require "../index.coffee"

describe "FED_DOC", ->
	it "Should get object list", ->
		objList = fedDoc.makeDoc("#{__dirname}/res")
