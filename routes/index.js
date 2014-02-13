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

var events = require('../events.json')

exports.listview = function(req, res) {
  res.render('listview', events);
};
