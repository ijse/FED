###
	Proxy Server

	@author ijse
###

httpProxy = require "http-proxy"
path = require "path"
ProxyInstance = null

# Proxy Server Midleware
# ======================
# if local resource not exist,
# proxy to remote server by configuration
proxyServerMidleware = (req, res, next) ->
	# Check if static resource exist
	sfile = path.join req.app.get('static resource'), req.path
	next() if path.existsSync sfile

	buffer = httpProxy.buffer req
	proxySetting = req.app.get 'proxy setting'

	# Proxy the request
	ProxyInstance.proxyRequest req, res, {
		host: proxySetting.remote.host
		port: proxySetting.remote.port
		buffer: buffer
	}

# Create proxy server
# ===================
createServer = (pSetting)->
	httpProxy.createServer { router: pSetting.router }

# Entry of plugin
# ================
# Initialize the plugin with config, add hooks
exports.init = (config) ->

	this.on "appinit3", (app)->

		app.enable 'trust proxy'
		config = app.get "proxy setting"
		ProxyInstance = new httpProxy.RoutingProxy()

		# Re-emit events on request for proxy
		app.use (req, res, next)->
			req.removeAllListeners 'data'
			req.removeAllListeners 'end'
			next()
			process.nextTick ->
				req.emit 'data', JSON.stringify(req.body)
				req.emit 'end'

		app.use proxyServerMidleware



