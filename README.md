FED - feed front end
====================

## 简介

FED 是一个前端开发环境，供前端编写简单的后台接口，以调试开发页面; 前端可以在此环境下，使用真实的URL访问地址访问，并可嫁接于其它服务器调试页面（调试线上代码), 可以写页面模板代码并使用测试数据调试输出，最终可生成文档。


## 特性

* 支持完全的FreeMaker模板渲染
* 支持配置模板全局变量
* 支持各种格式的返回数据
* 支持GET、POST等所有HTTP请求，可修改HTTP头
* 支持AJAX、JSONP请求
* 内含http-proxy模块，支持调试线上代码
* 真实URL地址访问，与线上访问保持一致
* 支持基于代码注释标记的文档输出功能

## Start

	$> node-dev launcher.js

## About Proxy

1. Set HOSTS, add url to localhost
2. Modify `globalConfig.js` to fit your needs
3. Start to use

## Test

	> npm test

