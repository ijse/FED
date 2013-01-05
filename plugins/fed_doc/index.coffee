###
	Make document from code

	@author ijse
###

path = require("path")
fs = require("fs")

dataHelper = require("./lib/dataHelper")
ejs = require("ejs")

exports.makeDoc = (bpath, toFile)->
	tpl = "/template/backbone-style.ejs"
	# Get data tree
	objList = dataHelper.getDataObj bpath

	writeToFile objList, toFile, tpl
	return

writeToFile = (objList, filename, template)->
