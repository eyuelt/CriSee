exports.view = function(req, res) {
  if (req.cookies.username) {
    res.render('index', {"username":req.body.username});
  } else {
    res.redirect('/signin');
  }
};
