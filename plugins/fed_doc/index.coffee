###
	Make document from code

	@author ijse
###

path = require("path")
fs = require("fs")

dataHelper = require("./lib/dataHelper")
ejs = require("ejs")

exports.makeDoc = (bpath, toFile)->
	tpl = "#{__dirname}/template/backbone-style.ejs"
	tplCnt = fs.readFileSync(tpl);

	# Get data tree
	objList = dataHelper.getDataObj bpath
	console.log objList

	html = makeHtml { data: objList }, "" + tplCnt

	writeToFile toFile, html

	return


#TODO: Render template with datas
makeHtml = (objList, template)->
	tpl = ejs.compile template, {compileDebug: true}
	return tpl objList

#TODO: Write to file
writeToFile = (filename, html)->
	fs.writeFileSync(filename, html)