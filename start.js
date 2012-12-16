
/**
 * @author : ijse
 */
var express = require('express'),
    routes = require('./backend'),
    http = require('http');

var app = express();

var gConfig = require("./globalConfig.js");

app.configure(function(){
  app.set('port', gConfig.port || process.env.PORT || 3000);
  app.set('views', gConfig.views);
  app.set('view engine', 'ftl');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('ijse'));
  app.use(express.session());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.locals(gConfig.globals);

routes.initWith(app);

http.createServer(app).listen(app.get('port'), function(){
  console.log("FED server listening on port " + app.get('port'));
});
