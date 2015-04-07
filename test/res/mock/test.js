
module.exports = function(req, res, next) {
  res.render('myview.ftl', { 'greeting': 'hello' });
}