var models = require('../models');

exports.getEvents = function(req, res) {
  var search_options = {};
  var date = undefined;
  if (req.query.date !== undefined) {
    date = new Date(req.query.date);
    search_options.deadline = date;
  }
  console.log(search_options);
  models.Event.find(search_options).exec(function(err, events) { //sort?
    if (err) { console.log(err); res.send(500); }
    var result = {};
    result.date = (date === undefined) ? "All" : date.toDateString();
    result.events = events;
    res.json(result);
  });
};
