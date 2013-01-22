`
/**
 * Export Html with template
 *
 * @author ijse
 */
`
#TODO: AUTO RE-GENERATE HTML FILE

# load configs
Config = require "./config.json"
util = require "./lib/util"
path = require "path"

# Load template engine
exports.init = (opts)->
	this.on "commandinit", (cmd)->
		cmd
		.command('2html')
		.option('-C, --config <configFile>', "the config file")
		.description('exports html')
		.action (cmd)->

			opts = resolveConfig cmd.config

			# parse files
			doParse opts
			# process.exit()

###
	Resolve views to file
	@param {object} opts the config object
	@param {function} cb the callback
###
doParse = (config, cb)->
	tengine = require config.engine

	config.pages.every (page)->
		parsePage
		# Add watch to each file


	# done!
	cb?()
	return


parsePage = (page)->
	# Make dirs if not exist
	util.mkdirParent path.dirname(page.toFile), null, ->
		# Make view data
		viewData = util.mergeData config.global, page.data
		viewData = util.mergeData {
			settings: {
				encoding: config.encoding
				views: config.basePath
			}
		}, viewData

		# Render the file
		tengine.renderFile page.fromView, viewData, (err, data)->
			throw err if err
			# Write to dest-file
			util.writeToFile data, page.toFile, config.encoding

###
	@param {string} cfgFile the config filename
###
resolveConfig = (cfgFile)->

	# Require config file
	configFile = util.realPath cfgFile
	opts = require configFile

	opts.basePath = util.realPath opts.basePath
	opts.savePath = util.realPath opts.savePath
	opts.pages.every (item)->
		item.toFile = util.joinPath opts.savePath, item.toFile
		item.fromView = util.joinPath opts.basePath, item.fromView
	return opts


exports.doParse = doParse
exports.resolveConfig = resolveConfig