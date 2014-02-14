exports.view = function(req, res) {
  res.render('signup');
};

var users = require('../users.json');

exports.signup = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;
  if (!nameInUse(username)) {
    users.users.push({ 'username':username, 'password':password });
    res.redirect('/'); //say successfully added
  } else {
    res.redirect('signup'); //say name in use
  }
};

function nameInUse(username) {
  var usersArray = users.users;
  for (var i = 0; i < usersArray.length; i++) {
    if (username !== undefined && username.toLowerCase() === usersArray[i].username.toLowerCase()) {
      return true;
    }
  }
  return false;
};
