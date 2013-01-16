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
		.option('-f, --backend <folder>', 'The backend folder')
		.option('-d, --destination <dest>', 'Where to save the doc')
		.description('Show help')
		.action (cmd)->
			bkPath = cmd.backend
			bkPath = (path.join process.cwd(), bkPath) if bkPath[0] is "."

			destPath = cmd.destination
			destPath = (path.join process.cwd(), destPath) if destPath[0] is "."

			makeDoc(bkPath, destPath);
			process.exit()


exports.makeDoc = makeDoc = (bpath, toFile)->
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