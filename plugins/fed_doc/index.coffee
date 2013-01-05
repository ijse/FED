###
	Make document from code

	@author ijse
###

dataHelper = require("./lib/dataHelper")

exports.makeDoc = (bpath)->
	# Get data tree
	objList = dataHelper.getDataObj bpath

	return objList