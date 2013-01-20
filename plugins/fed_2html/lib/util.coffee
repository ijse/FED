`
/**
 * Utils for fed_2html
 *
 * @author ijse
 */
`
path = require "path"
fs = require "fs"

exports.joinPath = path.join
# Realize path
exports.realPath = (filePath)->
	if filePath[0] is "."
		return path.join process.cwd(), filePath
	else
		return path.normalize filePath


mkdirParent = (dirPath, mode, callback)->
	# Call the standard fs.mkdir
	fs.mkdir dirPath, mode, (error)->
		#When it fail in this way, do the custom steps
		if error?.errno is 34
			#Create all the parents recursively
			mkdirParent path.dirname(dirPath), mode, callback
			#Then the directory
			mkdirParent dirPath, mode, callback
		#Manually run the callback since we used our own callback to do all these
		callback?(error)


# Create directories whatever it exist
mkdirs = (dirpath, callback)->
	fs.exists dirpath, (exists)->
		if exists
			callback(dirpath)
		else
			mkdirs path.dirname(dirpath), ->
				fs.mkdir dirpath, callback


mkdirsSync = (dirpath)->
	if fs.existsSync dirpath
		return
	else
		mkdirs path.dirname(dirpath)


exports.mkdirs = mkdirs
exports.mkdirsSync = mkdirsSync
exports.mkdirParent = mkdirParent


# Write htmls to file
exports.writeToFile = (data, file, encoding, callback)->
	fs.writeFileSync file, data, encoding, callback

# Merge two config objects
exports.mergeData = (obj1, obj2)->
	for k of obj1
		obj2[k] = obj1[k]
	return obj2