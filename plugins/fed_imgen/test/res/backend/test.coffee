
module.exports =
	"get /_/:settings": (req, res)->
		settings = req.param("settings")
		[size, color] = settings.split(/\|/)
		[width, height] = size.split(/x|X/)
		height = width if not height

		@render.text "#{width},#{height}|#{color}"
