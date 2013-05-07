
path_normalize = require("path").normalize
ftlEngine = require "./TemplateRun.js"

ftlRender =(res)->
    return (tpl, data)->
        res.set('Content-Type', 'text/html')
        res.render(tpl + '.ftl', data)

renderFile = (path, options, fn)->
	templateName = ""
	viewsDir = path_normalize(options.settings.views)
	templateName = path.replace(viewsDir, "")
	templateName = templateName.replace(/^(\/|\\)/, "")

	try
		ftlEngine.processTemplate({
			settings: {
				"encoding": options.settings.fileEncoding || "utf-8"
				"viewFolder": viewsDir
			}
			"fileName": templateName
			data: options
			callback: fn
		})
	catch err
		fn err
		throw err

exports.init = ()->
	# Regist render engine to app
	Hub.on "localServer.renderEngine.regist", (param)->
		app = param.app
		app.engine('ftl', renderFile)

		# Add render hook
		app.get("render manager").add("ftl", ftlRender)
		return

	return {
		renderFile: renderFile
	}
