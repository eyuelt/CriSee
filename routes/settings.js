exports.view = function(req, res) {
  if (!req.cookies.user_id) {
    res.redirect('/signin');
  } else {
    res.render('settings');
  }
};

exports.save = function(req, res) {
  console.log(req.body);
  res.redirect('/settings');
};
