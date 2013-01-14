###
	Make document from code

	@author ijse
###

path = require("path")
fs = require("fs")

dataHelper = require("./lib/dataHelper")
ejs = require("ejs")


exports.init = (opts)->
	this.on "commandinit", (cmd)->
		cmd
		.command('doc')
		.option('-d, --destination <dest>", "where to save the doc')
		.description('Show help')
		.action (cmd)->
			console.log cmd.destination
			process.exit()


exports.makeDoc = (bpath, toFile)->
	tpl = "#{__dirname}/template/backbone-style.ejs"
	tplCnt = fs.readFileSync(tpl);

	# Get data tree
	objList = dataHelper.getDataObj bpath

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