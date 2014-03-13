var models = require('../models');
var ObjectId = require('mongoose').Types.ObjectId;

exports.view = function(req, res) {
  if (!req.cookies.user_id) {
    res.redirect('/signin');
  } else {
    res.render('settings');
  }
};

exports.save = function(req, res) {
  var newSettings = new models.Settings({
    "user_id": req.cookies.user_id,
    "reminders": (req.body.onoffswitch) ? true : false,
    "food": (req.body.food) ? true : false,
    "sleep": (req.body.sleep) ? true : false,
    "exercise": (req.body.exercise) ? true : false,
    "phone": (!isNaN(parseInt(req.body.phone))) ? parseInt(req.body.phone) : null
  });

  var search_options = {'user_id':ObjectId(req.cookies.user_id)};
  models.Settings.findOne(search_options, function(err, settings) {
    if (err) {
      console.log(err);
      res.send(500);
    } else if (settings === null) {
      //No existing settings object in db for this user, so create one
      newSettings.save(function(err) {
        if (err) { console.log(err); res.send(500); }
        res.redirect('/settings?saved=1');
      });
    } else {
      //Update existing settings object
      settings.reminders = newSettings.reminders;
      settings.food = newSettings.food;
      settings.sleep = newSettings.sleep;
      settings.exercise = newSettings.exercise;
      if (newSettings.phone !== null) settings.phone = newSettings.phone;
      settings.save(function(err) {
        res.redirect('/settings?saved=1');
      });
    }
  });
};
