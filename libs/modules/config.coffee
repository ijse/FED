
module.exports = {
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