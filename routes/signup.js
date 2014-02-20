exports.view = function(req, res) {
  res.render('signup');
};

var models = require('../models');

exports.signup = function(req, res) {
  var newUser = new models.User({
    "username": req.body.username,
    "password": req.body.password
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
        res.redirect('/'); //TODO: say successfully added
      };
    } else {
      res.redirect('signup'); //TODO: say that name is in use
    }
  });
};
