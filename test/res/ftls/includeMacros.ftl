<#import "macros.ftl" as mc />
<!DOCTYPE HTML>
<html lang="en-US">
<head>
	<meta charset="UTF-8">
	<title>${title}</title>
</head>
<body>
	<h1>${title}</h1>
	<hr>
	<@mc.showMessage msg=message />
</body>
</html>