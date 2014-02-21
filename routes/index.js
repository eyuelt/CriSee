exports.view = function(req, res) {
  if (req.cookies.username) {
    res.redirect('/calendar');
  } else {
    res.redirect('/signin');
  }
};

exports.calendarview = function(req, res) {
  var options = {};
  if (req.query.eventadded) options.event_added = true;
  if (req.query.eventedited) options.event_edited = true;
  res.render('calendarview', options);
};

var models = require('../models');

exports.listview = function(req, res) {
  models.Event.find({ 'user_id': req.cookies.user_id }).exec(function(err, events) {
    if (err) { console.log(err); res.send(500); }
    res.render('listview', { 'events': events } );
  });
};
