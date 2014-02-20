exports.view = function(req, res) {
  if (req.cookies.username) {
    res.redirect('/calendar');
  } else {
    res.redirect('/signin');
  }
};

exports.calendarview = function(req, res) {
  res.render('calendarview');
};

var models = require('../models');

exports.listview = function(req, res) {
  models.Event.find({ 'user_id': req.cookies.user_id }).exec(function(err, events) {
    if (err) { console.log(err); res.send(500); }
    res.render('listview', { 'events': events } );
  });
};
