
fedUtils = require("../libs/utils")


##TODO: COVER ALL APIs

describe "fedUtils", ()->
	it "#traverseFolderSync()", ()->
		fedUtils.traverseFolderSync __dirname + "/res", ()->
