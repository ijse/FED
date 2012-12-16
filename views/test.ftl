<html>
<head>
  <title>FreeMarker Example Web Application 1</title>
</head>
<body>
	<h1>${appName} - ${version} +大要d s </h1>
	<#include "folder/aa.ftl" />
  	${message}: ${aaa!"undefined"}

  	${baseUrl!""}
</body>
</html>