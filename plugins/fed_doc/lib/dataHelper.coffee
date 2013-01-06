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
				"package": tpackage
				"files": getDataObj file
				"leaf": false
			}
		else
			routeList = processFile(file);
			result.push {
				package: tpackage
				class: f
				file: file
				leaf: true
				routeList: routeList
			}

	return result

# Process the routes in file
processFile = (file)->
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
		result.push tobj

	return result


# Export fn
exports.getDataObj = getDataObj