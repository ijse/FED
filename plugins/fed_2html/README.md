fed_2html
==========
实现静态页生成，适于无后端业务逻辑的需求。

前端开发时可以预定义公共碎片、模板变量等，方便开发和维护。

# 使用方法

1. 修改配置文件

```
	{
		// 模板引擎
		"engine": "ejs",
		// 模板编码
		"encoding": "utf-8",
		// 相对于命令执行时当前目录
		"basePath": "./plugins/fed_2html/test/res",
		// 生成的静态文件保存地址，相对于命令执行当前目录
		"savePath": "./test/htmls",
		// 模板中所用的全局变量
		"global": {
			"basePath": "http://app.changyou.com"
		},
		// 静态页配置
		"pages": [
			{
				// 模板文件，地址相对于basePath
				"fromView": "/test.ejs",
				// 保存的文件名，地址相对于basePath
				"toFile": "/test.html",
				// 此模板页中所需要的数据
				"data": {
					"test": "hello world"
				}
			}
		]
	}
```

2. 执行命令：

```
	fed 2html -C path/to/config/file
```

之后，便会在"savePath"所指定的目录中生成相应静态文件

## 其它说明

目前所实现的功能很简单，仅支持根据配置文件中的配置数据编译模板，并生成静态文件。
