
<#macro showMessage msg>
	<b>Message: ${msg}</b>
</#macro>

<!DOCTYPE HTML>
<html lang="en-US">
<head>
	<meta charset="UTF-8">
	<title>${title}</title>
</head>
<body>
	<h1>${title}</h1>
	<#-- ${message} -->
	<@showMessage msg=message />

</body>
</html>