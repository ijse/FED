
module.exports = {
	server: {
		enable: true
		command: {
			name: "server"
			options: {
				"watch": {
					alias: "w"
					boolean: true
					describe: "Restart server when file changes"
				},
				"port": {
					alias: "p"
					describe: "Set service port"
				}
			}
		}
	},
	generate: {
		enable: true
		command: {
			name: "gen"
			options: {
				"silent": {
					alias: "S"
					boolean: true
					default: undefined
					describe: "Generate without interaction"
				}
			}
		}
	},
	fedhtml: {
		enable: true
		command: {
			name: "parse"
			options: {
				"configFile": {
					alias: "c"
					demand: true
					describe: "The config file"
				}
			}
		}
	},
	fedDoc: {
		enable: true
		command: {
			name: "doc"
			options: {}
		}
	},
	freemarker: {
		enable: true
	},
	lesscss: {
		enable: true
		useTmpDir: true
		force: true
		optimization: 1
		debug: true
		compress: true
		dumpLineNumbers: "mediaquery"
	},
	coffeescript: {
		enable: true
		useTmpDir: true
		force: true
		once: false
		debug: true
		prefix: ""
	}
}