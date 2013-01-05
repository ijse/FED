###
	转换分析注释
	@author ijse
###
fs = require "fs"

## 根据内容提取信息元
exports.parse = (fnDef, cmd)->
	cmtStr = getCommentStr fnDef
	# return {} if not cmtStr
	return {
		# parse from comment content
		leaf: false
		title: parser.getTitle cmtStr
		author: parser.getAuthor cmtStr
		desc: parser.getDesc cmtStr
		params: parser.getParams cmtStr
		return: parser.getReturn cmtStr

		# parse from define body
		fnCmt: cmtStr
		fnDef: fnDef
		async: parser.getAsync cmtStr
		URI: parser.getURI cmd
		method: parser.getMethod cmd
	}


parser = {
	getTitle: (str)->
		reg = /(.*)[\r\n]/g
		reg.exec(str)?[1]?.trim()

	getAuthor: (str)->
		reg = /@author\s(.*)/mgi
		reg.exec(str)?[1]?.trim()

	getDesc: (str)->
		reg = /[\r\n]([\s\S]*?)@/mgi
		reg.exec(str)?[1]?.trim()

	getParams: (str)->
		result = []
		reg = /@param\s(.*?)\s([^@]*)(?=@|\*\/)/mgi
		loop
			res = reg.exec(str)
			if res
				result.push {arg: res[1]?.trim(), desc: res[2]?.trim()}
			break if not res
		return result

	getReturn: (str)->
		reg = /@return\s(.*)(?=@|\*\/)/mgi
		reg.exec(str)?[1]?.trim()

	getAsync: (str)->
		reg = /@async(?!\s*false)/mi
		reg.test(str)

	getURI: (str)->
		str.split(" ")?[1]?

	getMethod: (str)->
		str.split(" ")?[0]?

}

# Get comment info from function-define-text
getCommentStr = (fctn)->
	reg = ///
		/\*\*	# /***
		([\s\S]*)	# xxx
		\*/		# */
	///gi
	re = reg.exec fctn
	# Remove * in the begin of lines
	result = re?[1]?.replace(/^\s*\*?/mg, "")
	result = result?.trim()

	return result