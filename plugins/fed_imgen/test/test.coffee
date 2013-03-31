TEST_PORT = 3210

assert = require "assert"
Request = require "supertest"
localServer = require "../../../localServer"

# Set up local service
request = Request(localServer.create {
	path: {
		views: __dirname + "/res/views",
		public: __dirname + "/res/public",
		backend: __dirname + "/res/backend",
	},
	proxy: {
		enable: false
	}
})

describe "测试动态生成占位图片", ->
	describe "URL传参测试", ->
		it "获得正确的width和height", (done)->
			request
				.get("/_/200x100")
				.expect(200, /^200,100/)
				.end(done)
		it "只指定一个参数时，默认为width=height", (done)->
			request
				.get("/_/200")
				.expect(200, /^200,200/)
				.end(done)
		it "大写X分隔尺寸", (done)->
			request
				.get("/_/200X100")
				.expect(200, /^200,100/)
				.end(done)
		it "获得尺寸和颜色设定", (done)->
			request
				.get("/_/200x100|red")
				.expect(200, /^200,100\|red$/)
				.end(done)
		it "综合测试", (done)->
			request
				.get("/_/200|(13,15,16)")
				.expect(200, /^200,200\|\(13,15,16\)$/)
				.end(done)
