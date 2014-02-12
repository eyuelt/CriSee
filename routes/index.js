exports.view = function(req, res) {
/*  if (req.query.auth === "true") {
    res.render('index', {"username":req.query.username});
  } else {
    res.redirect('/signin');
  }*/
  res.redirect('/calendar');
};

exports.calendarview = function(req, res) {
  res.render('calendarview');
};

var events = require('../events.json')

exports.listview = function(req, res) {
  res.render('listview', events);
};
