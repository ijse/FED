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

	html = makeHtml objList, tpl

	writeToFile toFile, html

	return


#TODO: Render template with datas
makeHtml = (objList, template)->
	tpl = ejs.compile template
	return tpl objList

#TODO: Write to file
writeToFile = (filename, html)->
	fs.writeFileSync(filename, html)