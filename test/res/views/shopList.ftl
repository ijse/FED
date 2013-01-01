<!DOCTYPE HTML>
<html lang="en-US">
<head>
	<meta charset="UTF-8">
	<title>${title}</title>
</head>
<body>
	<h1>${title}</h1>
	<hr>
	<ul>
		<#list shopList as v>
			<li>${v}</li>
		</#list>
	</ul>
</body>
</html>