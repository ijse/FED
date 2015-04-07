
// // fed server
// program
//   .command('server')
//   .description('Launch local http service with serve2')
//   .allowUnknownOption()
//   .option('-h, --help', 'show help', serve2.showHelp)
//   .option('    --view-root <viewRoot>', 'freemarker templates root folder')
//   .action(serve2.start.bind(null, function() {
//     console.log('Server start at port %s in dir %s. ', this.port, this.path)
//   }));

var Serve2 = require('serve2');
var program = Serve2.cli;
var Freemarker = require('freemarker.js');

program
  .option('    --view-root <viewRoot>', 'freemarker templates root folder')

program.parse(process.argv);

var server = new Serve2(program, function(notify) {

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

server.start(function() {
  console.log('\033[90mserving \033[36m%s\033[90m on port \033[96m%d\033[0m', server.path, server.port);
});

