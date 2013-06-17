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
jsYaml = require "js-yaml"

#
exports.exec = (args, cmdConfig)->
	# If configFile not exist, exit
	if not args.configFile
		console.error "Need Config file!"
		return

	# Convert configFile path to real path
	console.log "\nRead and parse config file"
	configFile = fedUtil.realPath process.cwd(), args.configFile

	# Load configFile
	config = require configFile

	# Parse configs
	config.viewPath = fedUtil.realPath path.dirname(configFile), config.viewPath
	config.destPath = fedUtil.realPath path.dirname(configFile), config.destPath
	config.mockPath = fedUtil.realPath path.dirname(configFile), config.mockPath

	# Prepare..
	tplEngine = require config.engine

	console.log "Start parsing...\n==========================\n"
	startTime = Date.now()

	# Traverse mocks, export
	excludeFile = /^(\.|_)/; # exclude files name begin of "."
	fedUtil.traverseFolderSync config.mockPath, excludeFile, (err, file)->

		return if err

		# handle the mock(s)
		mocks = require file

		console.log "Load mock: #{file}"
		
		# Check if bach news
		mocks = generateMocks(mocks, config) if mocks.batch

		mocks = [mocks] if not mocks instanceof Array

		# for mock in mocks
		mocks.forEach (mock, n)->
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
				console.log "- done #{n+1} of #{mocks.length}"
		return
	endTime = Date.now()
	console.log "\n=======================\nfedHtml: All done within #{(endTime-startTime)/1000}s!"

generateMocks = (obj, config)->
	mockList = []
	sharedData = obj.shared or {}

	traPath = path.join config.mockPath, obj.from
	# Traverse folder, read each file
	fedUtil.traverseFolderSync traPath, (err, file)->

		return if err

		# Read file as text
		data = fs.readFileSync file, "utf-8"

		# Split content to yaml info and article content
		reg = /(?:---[\s\S]([\s\S]*)---)?([\s\S]*)/
		r = reg.exec(data)
		if r isnt null
			yamlData = r[1]
			ctnData = r[2]

		console.log "yaml data before: ", yamlData
		# parse yaml
		preConfig = jsYaml.load(yamlData)

		# Merge yaml info, article content with mocks
		mock = {
			template: obj.template
			toFile: path.join(obj.toFolder, path.basename(file))
		}

		mock.data = fedUtil.extend obj.shared, preConfig, {
			content: ctnData
		}

		console.log "mock: ", mock
		# Append mockList
		mockList.push mock

	console.log mockList

	return mockList







