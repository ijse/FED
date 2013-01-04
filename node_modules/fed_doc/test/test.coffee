###
#	Test fed_doc
#	@author: ijse
###
path = require "path"
should = require("chai").should()
fedDoc = require "../index.coffee"

tpath = "#{__dirname}/res"
describe "FED_DOC", ->
	describe "获取数据源", ->
		it "获取处理文件列表", ->
			files = [
				path.join(tpath, "/a.js"),
				path.join(tpath, "/b.js"),
				path.join(tpath, "/fo/c.js")
			]

			# listFiles()
			list = fedDoc.listFiles tpath
			files.length.should.equal list.length
			list.should.include files[0]
			list.should.include files[1]
			list.should.include files[2]

		it "提取出正确的注释内容", ->
			# grepComment()
			tfile = "#{tpath}/a.js"
			dComment = "\
User login method\r
   some description\r
 @author ijse\r
 @param name username\r
 @param pass password\r
 @return success|fail"
			result = fedDoc.grepComment tfile
			result.should.equal dComment

	describe "解析注释内容", ->
		str = "\
User login method\r
   some description\r
 here is
 @param name username\r
 @param pass password\r
 @return success|fail
 abc
 @author ijse\r
 "

		it "#title 方法名", ->
			r = fedDoc.parser.title(str)
			r.should.to.be.a "string"
			r.should.to.equal "User login method"

		it "#desc 方法描述", ->
			r = fedDoc.parser.desc(str)
			r.should.to.be.a "string"
			r.should.to.equal "some description\r here is"

		it "#params 请求参数", ->
			params = fedDoc.parser.params(str)
			params.length.should.equal 2
			params.should.to.be.a "array"
			params[0].should.eql { arg: "name", desc: "username" }
			params[1].should.eql { arg: "pass", desc: "password" }

		it "#author 方法作者", ->
			r = fedDoc.parser.author(str)
			r.should.to.be.a "string"
			r.should.to.equal "ijse"

		it "#return 请求返回值", ->
			r = fedDoc.parser.return(str)
			r.should.to.be.a "string"
			r.should.to.equal "success|fail abc"




