###
	Make data object

	@author ijse
###

fs = require "fs"
path = require "path"
parser = require "./parserHelper"


getDataList = (tpath, basePath)->
	result = []
	if not basePath
		packageName = path.basename basePath
	else
		packageName = tpath.replace basePath, ""

	list = fs.readdirSync tpath
	for f in list
		file = path.join tpath, f
		if fs.lstatSync(file).isDirectory()
			result.push {
				"package": packageName
			}
	return

# TODO: NEED TO REDESIGN DATA CONSTRUCTOR!!!
#
# Get list of all files under `basePath`
# all item is absoulte path
getDataObj = (tpath)->
	result = []
	tpackage = path.basename tpath
	list = fs.readdirSync tpath
	for f in list
		file = path.join(tpath, f)
		if fs.lstatSync(file).isDirectory()
			result.push {
				"name": tpackage
				"leaf": false
				"children": getDataObj file
			}
		else
			routeList = processFile(file, tpackage, f);
			if routeList.length > 0
				result.push {
					"name": tpackage
					"leaf": false
					"class": f
					"file": file
					"children": routeList
				}

	return result

# Process the routes in file
processFile = (file, tpackage, f)->
	result = []
	# Include route file, get all definitions
	routes = require file
	for route of routes
		routeFn = routes[route]
		continue if not routeFn
		# function string
		fnDef = routeFn.toString()
		# comment info obj
		tobj = parser.parse(fnDef, route)
		tobj.class = "#{tpackage}/#{f}"
		result.push tobj

	return result


# Export fn
exports.getDataObj = getDataObj