
var resolve = require('path').resolve;
var join = require('path').join;

var Serve2 = require('serve2');
var Freemarker = require('freemarker.js');

exports.showHelp = function() {
  Serve2.cli.parse([, 'fed server']);
}

exports.start = function(done) {
  var argObj = arguments[arguments.length-1];
  argObj.parent.rawArgs.shift();

  var serv = new Serve2(argObj.parent.rawArgs, function(notify) {

    // Since `serv` havn't returned
    var serv = this;

    // load middlewares

    notify.on('beforeMock', function(app, opts) {

      if(!argObj.viewRoot) return ;

      var viewRoot = join(serv.path, argObj.viewRoot);

      var freemarker = new Freemarker({
        viewRoot: viewRoot
      });

      app.use(function(req, res, next) {
        res.render = (function(view, data, done) {
          var _this = this;
          freemarker.render(view, data, function(err, data, out) {
            _this.end(data||out);
            done && done(err, data||out);
          });
        }).bind(res);

        next();
      });

      app.render = freemarker.render;
    });
  });

  serv.start(done);
}