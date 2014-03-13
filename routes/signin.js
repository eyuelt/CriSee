var models = require('../models');
var crypto = require('crypto');

var KDF_NUM_ITERS = 100000;
var KDF_KEY_SZ = 256;
var SALT_NUM_BYTES = 16;

exports.viewSignin = function(req, res) {
  var options = {};
  if (req.query.usercreated) options.username_created = true;
  if (req.query.badlogin) options.incorrect_login = true;
  res.render('signin', options);
};

exports.viewSignup = function(req, res) {
  var options = {};
  if (req.query.nameinuse) options.name_in_use = true;
  res.render('signup', options);
};

exports.signin = function(req, res) {
  checkLogin(req.body.username, req.body.password, function(isValidLogin, user_id) {
    if (isValidLogin) {
      var options = {};
      if (req.body.remember) options = { maxAge: 900000 };
      res.cookie('user_id', user_id, options);
      res.redirect('/');
    } else {
      res.redirect('/signin?badlogin=1');
    }
  });
};

function checkLogin(username, password, callback) {
  models.User.find({ "username": username }).exec(function(err, users) {
    if (err) { console.log(err); res.send(500); };
    if (users.length === 1) {
      var user = users[0];
      var key = crypto.pbkdf2Sync(password, user.salt, KDF_NUM_ITERS, KDF_KEY_SZ).toString('hex');
      if (user.key === key) {
        callback(true, user._id);
      } else {
        callback(false);
      }
    } else callback(false);
  });
};

exports.signup = function(req, res) {
  var salt = crypto.randomBytes(SALT_NUM_BYTES).toString('hex');
  var key = crypto.pbkdf2Sync(req.body.password, salt, KDF_NUM_ITERS, KDF_KEY_SZ).toString('hex');
  var newUser = new models.User({
    "username": req.body.username,
    "salt": salt,
    "key": key
  });

  models.User.find({ "username": newUser.username }).exec(function(err, users) { //make sure username is unique
    console.log("All of the users with the given username: " + users);
    var nameInUse = users.length > 0;
    if (!nameInUse) {
      newUser.save(afterSaving);
      function afterSaving(err) {
        if (err) {
          console.log(err);
          res.send(500);
        }
        res.redirect('/signin?usercreated=1');
      };
    } else {
      res.redirect('signup?nameinuse=1');
    }
  });
};

exports.signout = function(req, res) {
  res.clearCookie('user_id');
  res.redirect('/');
};
