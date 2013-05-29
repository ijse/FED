`
/**
 * Export Html with template
 *
 * @author ijse
 */
`
#TODO: AUTO RE-GENERATE HTML FILE

# load configs
fedUtil = require "../../utils"
path   = require "path"
fs = require "fs"

#
exports.exec = (args, cmdConfig)->
	# If configFile not exist, exit
	if not args.configFile
		console.error "Need Config file!"
		return

	# Convert configFile path to real path
	configFile = fedUtil.realPath process.cwd(), args.configFile

	# Load configFile
	config = require configFile

	# Parse configs
	config.viewPath = fedUtil.realPath path.dirname(configFile), config.viewPath
	config.destPath = fedUtil.realPath path.dirname(configFile), config.destPath
	config.mockPath = fedUtil.realPath path.dirname(configFile), config.mockPath

	# Prepare..
	tplEngine = require config.engine

	# Traverse mocks, export
	fedUtil.traverseFolderSync config.mockPath, (err, file)->
		# handle the mock(s)
		mocks = require file

		mocks = [mocks] if not mocks instanceof Array

		for mock in mocks
			template = path.join config.viewPath, mock.template
			toFile = path.join config.destPath, mock.toFile
			viewData = fedUtil.extend config.globals, mock.data, {
				settings: {
					template: template
					toFile: toFile
					encoding: config.encoding
					views: config.viewPath
				}
			}

			# Make sure the dest folder exist
			fedUtil.mkdirSync(path.dirname(toFile));

			# Render the file
			tplEngine.renderFile template, viewData, (err, data)->
				throw err if err
				fs.writeFileSync toFile, data, config.encoding

		return

	console.log "fedHtml: All done!"

