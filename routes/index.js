exports.view = function(req, res) {
    res.redirect('/calendar');
};

exports.calendarview = function(req, res) {
  if (!req.cookies.user_id) {
    res.redirect('/signin');
  } else {
    var options = {};
    if (req.query.eventadded) options.event_added = true;
    if (req.query.eventedited) options.event_edited = true;
    if (req.query.eventdeleted) options.event_deleted = true;
    res.render('calendarview', options);
  }
};

var models = require('../models');

exports.listview = function(req, res) {
  if (!req.cookies.user_id) {
    res.redirect('/signin');
  } else {
    models.Event.find({ 'user_id': req.cookies.user_id }).sort('deadline').exec(function(err, events) {
      if (err) { console.log(err); res.send(500); }
      var e = [];
      var upcoming = [];
      var today = todaysDate();
      for (var i = 0; i < events.length; i++) {
        e[i] = {};
        e[i]._id = events[i]._id;
        e[i].description = events[i].description;
        e[i].deadline = new Date(events[i].deadline).toDateString();
        if (new Date(e[i].deadline) >= today) upcoming.push(e[i]);
      }
      var options = {};
      options.events = e;
      options.upcoming_events = upcoming;
      res.render('listview', options);
    });
  }
};

function todaysDate() {
  var today = new Date();
  today.setHours(0);
  today.setMinutes(0);
  today.setSeconds(0);
  today.setMilliseconds(0);
  return today;
};
