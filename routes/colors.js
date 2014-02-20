var models = require('../models');
var ObjectId = require('mongoose').Types.ObjectId;

var NUM_DAYS_TRAIL_BACK = 5; //event difficulty only trails back 5 days for now

exports.getColors = function(req, res) {
  var monthyear = undefined;

  if (req.query.monthyear !== undefined) {
    monthyear = req.query.monthyear;

    var start = new Date(monthyear);
    var end = new Date();
    end.setMonth(start.getMonth() + 1);
    end.setDate(NUM_DAYS_TRAIL_BACK);

    var search_options = {};
    search_options.user_id = new ObjectId(req.cookies.user_id);
    search_options.deadline = {'$gte':start,'$lte':end};
    models.Event.find(search_options).exec(function(err, events) {
      var data = [];
      //get num days in month
      end.setDate(1);
      end.setDate(end.getDate()-1);
      var daysInMonth = end.getDate();
      //figure out difficulty value for non-zero difficulty days
      var eventmap = []; //contains a total difficulty val for each day of the month
      eventmap[daysInMonth-1] = undefined;
      for (var i = 0; i < events.length; i++) {
        addEventToEventMap(events[i], eventmap, start.getMonth(), daysInMonth);
      }
      //iterate over days in month to build up array to return
      for (var j = 0; j < daysInMonth; j++) {
        var eventdata = {
          'day': j+1,
          'value': (eventmap[j] === undefined) ? 0 : eventmap[j],
          'color': colorForVal(eventmap[j])
        };
        data.push(eventdata);
      }

      var result = {};
      result.monthyear = monthyear;
      result.data = data;
      res.json(result);
    });
  } else {
    var result = {};
    result.monthyear = "Invalid monthyear";
    result.data = [];
    res.json(result);
  }
};

function addEventToEventMap(event, eventMap, forMonth, daysInMonth) {
  var date = new Date(event.deadline);
  var day = date.getDate();
  if (date.getMonth() > forMonth) day += daysInMonth;

  for (var i = 0; i < NUM_DAYS_TRAIL_BACK; i++) {
    if (day-1-i >= 0 && day-1-i < eventMap.length) {
      if (eventMap[day-1-i] === undefined) eventMap[day-1-i] = 0;
      var time_discount = 1 - i/NUM_DAYS_TRAIL_BACK;
      var difficulty_discount = event.difficulty * 0.01;
      eventMap[day-1-i] += 1 * time_discount * difficulty_discount;
    }
  }
};

function colorForVal(val) {
  if (val < 0.3 || val === undefined) return "#00ff00"; //green
  else if (val < 0.7) return "#ffff00"; //yellow
  else return "#ff0000"; //red
};
