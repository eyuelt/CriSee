var models = require('../models');
var ObjectId = require('mongoose').Types.ObjectId;

var NUM_DAYS_TRAIL_BACK = 5; //event difficulty only trails back 5 days for now

var monochromatic = false;

exports.getColors = function(req, res) {
  var monthyear = undefined;
  monochromatic = req.query.monochromatic;

  if (req.query.monthyear !== undefined) {
    monthyear = req.query.monthyear;

    var start = new Date(monthyear);
    var end = new Date(start);
    end.setMonth(end.getMonth() + 1);
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
  /*
  if (val < 0.3 || val === undefined) return "#00ff00"; //green
  else if (val < 0.7) return "#ffff00"; //yellow
  else return "#ff0000"; //red
  */
  var percentVal = val * 100;
  if (percentVal > 100) percentVal = 100;
  // Uncomment this to make days with no events green
  //if (percentVal === undefined || isNaN(percentVal)) percentVal = 0;

  var red, green, blue;
  if (!monochromatic) { // For A/B testing
    if (percentVal > 50) {
      red = 255;
      green = 255 - ((percentVal - 50) * 5);
      blue = 0;
    } else {
      red = percentVal * 5;
      green = 255;
      blue = 0;
    }
  } else { // For A/B testing
    //red = 255 - ((percentVal) * 2.5);
    red = 245;
    green = (100 - percentVal) * 2.5;
    blue = (100 - percentVal) * 2.5;
  }
  var colorString = rgbToColorString(red, green, blue);
  return colorString;
};

function rgbToColorString(r, g, b) {
  r = parseInt(r.toFixed(0))
  g = parseInt(g.toFixed(0))
  b = parseInt(b.toFixed(0))
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
};

function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
};
