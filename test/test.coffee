

# test libs/core
#====================

# # 测试本地服务
require("./testLocalServer.coffee")

# # 测试 libs/utils
require("./testUtils.coffee")

# # test libs/modules
# #====================

# # 测试模板引擎 jar包
require("./testFreemarkerModule.coffee")

# # 测试即时编译LESS和coffee文件
require("./testJITModule.coffee")

# 测试fedhtml
require("./testFedHtml")
