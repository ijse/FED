###
#	Test fed_doc
#	@author: ijse
###

fs = require "fs"
path = require "path"

should = require("chai").should()
fedDoc = require "../index.coffee"

describe "FED_DOC", ->
	it "Should get export html file", ->
		srcFolder = "#{__dirname}/res"
		destFile = "#{__dirname}/testOut.html"
		objList = fedDoc.makeDoc(srcFolder, destFile)
		path.existsSync(destFile).should.ok