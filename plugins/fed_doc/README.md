Make doc for fed backend
========================
分析代码文件，生成文档文件

## 信息元

需要收集以下信息：

 * Package(folder)
 * Class(filename)
 * @Title
 * Desc
 * @Author
 * @Params(arg, intro)
 * @Return
 * Method(get|post|...)
 * @Async(true|false)
 * URI(/artical/list)

数据结构如下：

	[
		{
			folder: "/artical",
			leaf: false,
			items: [
				{
					folder: "/artical",
					leaf: true,
					class: "filename",
					title: "",
					desc: "",
					author: "",
					method: "get",
					async: true,
					URI: "/artical/list",
					params: [
						{ arg: "list", intro: ""},
						{ arg: "del", intro: ""}
					],
					return: ""
				}, {
					folder: "/artical/list",
					leaf: false,
					items: [
						{
							folder: "/artical/list",
							leaf: false,
							class: "filename"
						}
					]
				}
			]
		}
	]

说明：
	1. `package`是文件存放的文件夹路径，与`URI`无关
	2. `class`是文件名称，与`URI`无关
	3. `URI`是`fed("get /list")`中第一个参数包含的内容，实际访问路径
	4. `async`是否异步，为`true`时为异步请求；存在此标记即为`true`
	5. 标记"@"的参数为需要相应标记，其它不需要
	6. `desc` 紧跟`@title`之后，下一个"@"之前的内容
	7. `@param` 标记格式为"@param {arg} {intro}",其中"intro"为到下一个"@"之前的内容

