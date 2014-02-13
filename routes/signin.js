exports.view = function(req, res) {
  res.render('signin');
};

exports.login = function(req, res) {
  if (isValidLogin(req.body.username, req.body.password)) {
    var options = {};
    if (req.body.remember) options = { maxAge: 900000 };
    res.cookie('username', req.body.username, options);
    res.redirect('/');
  } else {
    res.redirect('/signin');
  }
};

var users = require('../users.json');

function isValidLogin(username, password) {
  var user_index = userIndexInJson(users.users, username);
  if (user_index >= 0) {
    if (password === users.users[user_index].password) {
      return true;
    }
  }
  console.log("Invalid login");
  return false;
};

function userIndexInJson(usersArray, username) {
  var user_index = -1;
  for (var i = 0; i < usersArray.length; i++) {
    if (username !== undefined && username.toLowerCase() === usersArray[i].username.toLowerCase()) {
      user_index = i;
      break;
    }
  }
  return user_index;
};
