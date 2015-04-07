
var should = require('should');

var Request = require('supertest');
var resolve = require('path').resolve;
var fed = resolve('./bin/fed.js');
var exec = function(cmd, cb) {
  require('child_process').exec(cmd, {timeout: 50000}, cb);
}

fed = [ 'node', fed, ' '].join(' ');

describe('Test fed showing help message', function() {

  it('show help message when -h', function(done) {
    exec(fed + '-h', function(err, so, se) {
      so.should.match(/Usage: fed \[options\] \[command\]/);
      done(err);
    });
  });

  it('show help message when help', function(done) {
    exec(fed + 'help', function(err, so, se) {
      so.should.match(/Usage: fed \[options\] \[command\]/);
      done(err);
    });
  });

  it('show sub command help message', function(done) {
    exec(fed + 'help server', function(err, so, se) {
      so.should.match(/Usage: fed server \[options\] \[dir\]/);
      done(err);
    });
  });

});

describe('Test fed showing versions', function() {

  var fedVer = require('../package').version;
  var serVer = require('../node_modules/serve2/package').version

  it('show fed version', function(done) {
    exec(fed + 'version', function(e, so, se) {
      so.should.match(new RegExp(fedVer));
      done(e);
    });
  });

  it('show serve2 version', function(done) {
    exec(fed + 'server version', function(e, so, se) {
      so.should.match(new RegExp(serVer));
      done(e);
    });
  });

  it('show fed and serve2 versions', function(done) {
    exec(fed + '-V', function(e, so, se) {
      so.should.match(new RegExp(fedVer));
      so.should.match(new RegExp(serVer));
      done(e);
    });
  });

});


describe('Test fed starting server', function() {

  after(function() {
    process.exit(0);
  });

  it('start static server default current workdir', function(done) {
    var p = exec(fed + 'server -p 3000 .', function(e) {
      console.log(arguments);
      done(e);
    });
    var request = Request('http://localhost:3000');
    setTimeout(function() {
      request
        .get('/package.json')
        .expect(200)
        .expect(/fed/)
        .expect(/version/)
        .end(done);
    }, 1500);
  });

  it('start server with freemarker suport', function(done) {
    var p = exec(fed + 'server -p 3000 -M mock --view-root view ./test/res');
    var request = Request('http://localhost:3000', function(e) {
      console.log(arguments);
      done(e);
    });
    setTimeout(function() {
      request
        .get('/test')
        .expect(200)
        .expect(/hello/)
        .expect(/inner/)
        .end(done);
    }, 1500);
  });

});