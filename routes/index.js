exports.view = function(req, res) {
  if (req.query.auth === "true") {
    res.render('index', {"username":req.query.username});
  } else {
    res.redirect('/signin');
  }
};
