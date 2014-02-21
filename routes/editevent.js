exports.view = function(req, res) {
  if (req.query.id) {
    var options = {};
    options.editing = true;
    options.id = req.query.id;
    if (req.query.missingfields) options.missing_fields = true;
    options.date = unformatDate(new Date().toDateString());
    res.render('addevent', options);
  } else {
    res.send(500);
  }
};

var models = require('../models');
var ObjectId = require('mongoose').Types.ObjectId;

//TODO: make this actually edit, not just add new
exports.editevent = function(req, res) {
  var description = req.body.description;
  var deadline = req.body.deadline;
  var difficulty = req.body.difficulty;
  if (description.length > 0 && deadline.length > 0) {
    deadline = formatDate(deadline);
    difficulty = (difficulty.length > 0) ? parseFloat(difficulty) : 0.0;
    var search_options = {'user_id':ObjectId(req.cookies.user_id), '_id':ObjectId(req.body.id)};
    models.Event.findOne(search_options, function (err, event) {
      if (err) {
        console.log(err);
        res.send(500);
      } else {
        event.description = description;
        event.deadline = deadline;
        event.difficulty = difficulty;
        event.save(function(err){
          res.redirect('/calendar?eventedited=1');
        });
      }
    });
  } else {
    res.redirect('editevent?id=' + req.body.id + '&missingfields=1');
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
