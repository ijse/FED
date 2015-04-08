
var should = require('should');

var Request = require('supertest');
var resolve = require('path').resolve;
var fed = resolve('./bin/fed.js');
var exec = function(cmd, cb) {
  require('child_process').exec(cmd, {timeout: 50000}, cb);
}
var spawn = require('child_process').spawn;

var fedbin = [ 'node', fed, ' '].join(' ');

var kill = function(pid) {
  if(process.platform === 'win32') {
    exec('taskkill /f /t /pid ' + pid);
  } else {
    exec('kill ' + pid);
  }
};

describe('Test fed showing help message', function() {

  it('show help message when -h', function(done) {
    exec(fedbin + '-h', function(err, so, se) {
      so.should.match(/Usage: fed \[options\] \[command\]/);
      done(err);
    });
  });

  it('show help message when help', function(done) {
    exec(fedbin + 'help', function(err, so, se) {
      so.should.match(/Usage: fed \[options\] \[command\]/);
      done(err);
    });
  });

  it('show sub command help message', function(done) {
    exec(fedbin + 'help server', function(err, so, se) {
      so.should.match(/Usage: fed-server \[options\] \[dir\]/);
      done(err);
    });
  });

});

describe('Test fed showing versions', function() {

  var fedVer = require('../package').version;
  var serVer = require('../node_modules/serve2/package').version

  it('show fed version', function(done) {
    exec(fedbin + 'version', function(e, so, se) {
      so.should.match(new RegExp(fedVer));
      done(e);
    });
  });

  it('show serve2 version', function(done) {
    exec(fedbin + 'server version', function(e, so, se) {
      so.should.match(new RegExp(serVer));
      done(e);
    });
  });

  it('show fed and serve2 versions', function(done) {
    exec(fedbin + 'versions', function(e, so, se) {
      so.should.match(new RegExp(fedVer));
      so.should.match(new RegExp(serVer));
      done(e);
    });
  });

});


describe('Test fed starting server', function() {
  this.timeout(5000);

  var p = null;
  it('start static server default current workdir', function(done) {
    p = spawn('node', [fed, 'server', '-p', '3001', '.'], {timeout: 5000});
    p.stderr.once('data', function(e) {
      console.log('error', ''+e);
      done(e);
    });
    p.stdout.once('data', function(d) {
      var request = Request('http://localhost:3001');
      request
        .get('/package.json')
        .expect(200)
        .expect(/fed/)
        .expect(/version/)
        .end(function() {
          kill(p.pid);
        });
    });

    p.once('exit', function() {
      done();
    });

  });

  it('start server with freemarker suport', function(done) {
    p = spawn('node', [fed, 'server', '-p', '3002', '-M', 'mock', '--view-root', 'view', './test/res'], {timeout: 5000});
    p.stderr.once('data', function(e) {
      console.log('error', ''+e);
      done(e);
    });
    p.stdout.once('data', function() {
      var request = Request('http://localhost:3002');
      request
        .get('/test.js')
        .expect(200)
        .expect(/hello/)
        .expect(/inner/)
        .end(function() {
          kill(p.pid);
        });
    });

    p.once('exit', function() {
      done();
    });

  });

});
