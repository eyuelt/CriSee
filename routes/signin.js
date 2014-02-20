exports.view = function(req, res) {
  res.render('signin');
};

var models = require('../models');

exports.login = function(req, res) {
  checkLogin(req.body.username, req.body.password, function(isValidLogin) {
    if (isValidLogin) {
      var options = {};
      if (req.body.remember) options = { maxAge: 900000 };
      res.cookie('username', req.body.username, options);
      res.redirect('/');
    } else {
      res.redirect('/signin');
    }
  });
};

function checkLogin(username, password, callback) {
  models.User.find({ "username": username }).exec(function(err, users) {
    if (err) { console.log(err); res.send(500); };
    if (users.length === 1 && users[0].password === password) callback(true);
    else callback(false);
  });
};

exports.logout = function(req, res) {
  res.clearCookie('username');
  res.redirect('/');
};
