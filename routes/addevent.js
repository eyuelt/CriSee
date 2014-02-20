exports.view = function(req, res) {
  res.render('addevent', {'title':'Add Event', 'buttontext':'Add Event to Calendar'});
};

var models = require('../models');

exports.addevent = function(req, res) {
  var description = req.body.description;
  var deadline = req.body.deadline;
  var difficulty = req.body.difficulty;
  if (description.length > 0 && deadline.length > 0) {
    deadline = formatDate(deadline);
    difficulty = (difficulty.length > 0) ? parseFloat(difficulty) : 0.0;
    var newEvent = new models.Event({
      "user_id": req.cookies.user_id,
      "description": description,
      "deadline": deadline,
      "difficulty": difficulty
    });
    newEvent.save(function(err) {
      if (err) { console.log(err); res.send(500); }
      console.log('just added: ' + newEvent);
      res.redirect('../'); //TODO: say event added
    });
  } else {
    res.redirect('../addevent'); //TODO: say invalid event
  }
};

// converts "2014-02-13" to "Thu Feb 13 2014"
function formatDate(datestr) {
  var dateArr = datestr.split('-');
  var year = dateArr.splice(0,1);
  dateArr = dateArr.concat(year);
  return new Date(dateArr.join(' ')).toDateString();
};
