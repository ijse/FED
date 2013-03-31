###
	Generate Image File
###
imageUtil = require("images")

exports.createImage = (fileName, width, height, color)->

	img = new imageUtil.Image(parseInt(width), parseInt(height))
	img.fill.apply(img, color)
	img.save(fileName)
	return fileName
