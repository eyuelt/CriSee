exports.view = function(req, res) {
  if (req.cookies.user_id) {
    res.redirect('/calendar');
  } else {
    res.redirect('/signin');
  }
};

exports.calendarview = function(req, res) {
  var options = {};
  if (req.query.eventadded) options.event_added = true;
  if (req.query.eventedited) options.event_edited = true;
  if (req.query.eventdeleted) options.event_deleted = true;
  res.render('calendarview', options);
};

var models = require('../models');

exports.listview = function(req, res) {
  models.Event.find({ 'user_id': req.cookies.user_id }).sort('-deadline').exec(function(err, events) {
    if (err) { console.log(err); res.send(500); }
    var e = [];
    for (var i = 0; i < events.length; i++) {
      e[i] = {};
      e[i]._id = events[i]._id;
      e[i].description = events[i].description;
      e[i].deadline = new Date(events[i].deadline).toDateString();
      console.log(e[i])
    }
    var options = {};
    options.events = e;
    res.render('listview', options);
  });
};
