
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Tweet Stream by Berico Technologies' })
};

