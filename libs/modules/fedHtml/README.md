fedHtml
==========
实现静态页生成，适于无后端业务逻辑的需求。

前端开发时可以预定义公共碎片、模板变量等，方便开发和维护。

# 使用方法

1. 修改配置文件

'''json
	{
		// 模板引擎
		"engine": "ejs",
		// 模板编码
		"encoding": "utf-8",
		// 相对于命令执行时当前目录
		"viewPath": "./plugins/fed_2html/test/res",
		// 生成的静态文件保存地址，相对于命令执行当前目录
		"destPath": "./test/htmls",
		// Mocks 数据文件
		"mockPath": "./mocks",
		// 模板中所用的全局变量
		"globals": {
			"basePath": "http://app.changyou.com"
		}
	}
'''

2. 执行命令：

	fed parse -c path/to/config/file

之后，便会在"savePath"所指定的目录中生成相应静态文件。

若要使用其它模板引擎，可以在FED根目录安装：

	fed> npm install handlebars

然后，在配置文件中配置相应名称即可。

## 其它说明

目前所实现的功能很简单，仅支持根据配置文件中的配置数据编译模板，并生成静态文件。