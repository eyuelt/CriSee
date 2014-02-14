var events = require('../events.json');

exports.getEvents = function(req, res) {
  var date = new Date(req.query.date);
  var eventsfordate = eventsForDate(date, events.events);
  res.json({'date':date.toDateString(),'events':eventsfordate});
};

//takes a date object and an array of events
//returns an array with the events for that date
function eventsForDate(date, eventsArray) {
  var eventsForDate = [];
  for (var i = 0; i < eventsArray.length; i++) {
    if (eventsArray[i].deadline == date.toDateString()) {
      eventsForDate.push(eventsArray[i]);
    }
  }
  return eventsForDate;
};
