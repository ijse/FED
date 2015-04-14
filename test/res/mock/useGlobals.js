
module.exports = function(req, res, next) {

  res.render('showGlobalVar.ftl', {
    greeting: 'Hello'
  });
};