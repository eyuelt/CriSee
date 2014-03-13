exports.view = function(req, res) {
  if (!req.cookies.user_id) {
    res.redirect('/signin');
  } else {
    res.render('settings');
  }
};


