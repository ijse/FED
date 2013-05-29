
fs      = require "fs"
prompt  = require "prompt"
fedUtil = require "../../utils/index"
path    = require "path"

schema = {
	properties: {
		fileName : {
			description: "Config file name:"
			default: "./config.json"
			required: true
		},
		port: {
			description: "HTTP Service port:"
			default: "3000"
		},
		path: {
			description: "Resource path"
			type: "object"
			properties: {
				view: {
					description: "ftl"
					default: "./view"
				}
				mock: {
					description: "mock files"
					default: "./mock"
				}
				public: {
					description: "static files"
					default: "./webapp"
				}
			}
		}

	}
}


# Initialize Prompt
initPrompt = ->
	prompt.message   = "?> ".green
	prompt.delimiter = ""
	prompt.override  = args
	return prompt


exports.exec = (args, cmdConfig)->

	prompt.message   = "?> ".green
	prompt.delimiter = ""
	prompt.override  = args

	prompt.start()
	prompt.get schema, (err, result)->
		fileName = result.fileName
		delete result.fileName
		result.globals = {}

		#TODO: Confirm when file exist

		# Auto create directory when directory not exist
		fedUtil.mkdirSync(path.dirname(fileName))

		# Write to file, override if exist
		fs.writeFileSync(fileName, JSON.stringify({ server: result }, null, 4), "utf-8")

		console.log("\nSuccess!".green + " Now you can edit #{fileName} as you want!")
		console.log("Start fed:".blue + " $> fed server #{fileName}")
	return

