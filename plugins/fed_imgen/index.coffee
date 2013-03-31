express = require "express"
imgGen = require "./imageGen"
fs = require "fs"
os = require "os"
path = require "path"

exports.init = (config)->
	cfg = {
		cacheTimeout: config.timeout || 5000
		url: config.url || "/_"
		defaultColor: [0xff, 0x01, 0xa2, 0.5]
		destPath: config.destPath || os.tmpDir()
	}
	this.on "appinit2", (app)->
		app.get "#{cfg.url}/:imageParams", (req, res, next)->
			imageParams = req.param("imageParams")
			[size, color] = imageParams.split(/-/)

			# normalize sizing
			[width, height] = size.split(/x|X/)
			height = width if not height
			[width, height] = [parseInt(width), parseInt(height)]

			# Params error
			if not width
				next()
				return

			# normalize color
			colorParam = if color then color.split(",") else cfg.defaultColor
			colorParam = [
				parseFloat(colorParam[0] || cfg.defaultColor[0])
				parseFloat(colorParam[1] || cfg.defaultColor[1])
				parseFloat(colorParam[2] || cfg.defaultColor[2])
				parseFloat(colorParam[3] || cfg.defaultColor[3])
			]


			fileName = path.join(cfg.destPath, "#{width}x#{height}-#{colorParam.join('_')}.png")

			# Hit Cache
			if not fs.existsSync(fileName)
				# Create image
				imgGen.createImage(fileName, width, height, colorParam)

				# Auto remove file after cacheTimeout
				setTimeout(->
					fs.unlinkSync(fileName)
				, cfg.cacheTimeout)

			# Send generated image
			res.sendfile(fileName)
			return
