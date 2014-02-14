exports.view = function(req, res) {
  res.render('addevent');
};

var events = require('../events.json');

exports.addevent = function(req, res) {
  var description = req.body.description;
  var deadline = req.body.deadline;
  var difficulty = req.body.difficulty;
  if (description.length > 0 && deadline.length > 0) {
    deadline = formatDate(deadline);
    difficulty = (difficulty.length > 0) ? parseFloat(difficulty) : 0.0;
    events.events.push({
      'description': description,
      'deadline': deadline,
      'difficulty': difficulty
    });
    console.log(events);
    res.redirect('../');
  } else {
    res.redirect('../addevent'); //say invalid event
  }
};

// converts "2014-02-13" to "Thu Feb 13 2014"
function formatDate(datestr) {
  var dateArr = datestr.split('-');
  var year = dateArr.splice(0,1);
  dateArr = dateArr.concat(year);
  return new Date(dateArr.join(' ')).toDateString();
};
