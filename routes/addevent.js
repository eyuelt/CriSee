exports.view = function(req, res) {
  var options = {};
  if (req.query.missingfields) options.missing_fields = true;
  if (req.query.date) options.date = unformatDate(req.query.date);
  else options.date = unformatDate(new Date().toDateString());
  res.render('addevent', options);
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
      res.redirect('/calendar?eventadded=1');
    });
  } else {
    res.redirect('addevent?missingfields=1'); //TODO: say invalid event
  }
};

// converts "2014-02-13" to "Thu Feb 13 2014"
function formatDate(datestr) {
  var dateArr = datestr.split('-');
  var year = dateArr.splice(0,1);
  dateArr = dateArr.concat(year);
  return new Date(dateArr.join(' ')).toDateString();
};

// converts "Thu Feb 13 2014" to "2014-02-13"
function unformatDate(datestr) {
  var d = new Date(datestr);
  var year = d.getFullYear();
  var month = d.getMonth() + 1;
  if (month < 10) month = "0" + month;
  var day = d.getDate();
  if (day < 10) day = "0" + day;
  return year + '-' + month + '-' + day;
};
