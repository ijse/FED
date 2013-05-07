
module.exports = {
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
		debug: false
		compress: true
		dumpLineNumbers: "mediaquery"
	},
	coffeescript: {
		enable: true
		useTmpDir: true
		force: true
		once: false
		debug: false
		prefix: ""
	}
}