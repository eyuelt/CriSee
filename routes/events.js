var models = require('../models');
var ObjectId = require('mongoose').Types.ObjectId;

exports.viewAddevent = function(req, res) {
  var options = {};
  if (req.query.missingfields) options.missing_fields = true;
  if (req.query.date) options.date = unformatDate(req.query.date);
  else options.date = unformatDate(new Date().toDateString());
  //options.monochromatic = req.query.monochromatic ? 1 : 0;
  options.monochromatic = 1;
  res.render('addevent', options);
};

exports.viewEditevent = function(req, res) {
  if (req.query.id) {
    var options = {};
    options.editing = true;
    options.id = req.query.id;
    if (req.query.missingfields) options.missing_fields = true;
    var search_params = {'user_id':ObjectId(req.cookies.user_id), '_id':ObjectId(req.query.id)};
    models.Event.findOne(search_params, function (err, event) {
      options.eventname = event.description;
      options.date = unformatDate(new Date(event.deadline).toDateString());
      options.stresslevel = event.difficulty;
      if (options.stresslevel > 100) options.stresslevel = 100;
      if (options.stresslevel === undefined || isNaN(options.stresslevel)) options.stresslevel = 0;
      //options.monochromatic = req.query.monochromatic ? 1 : 0;
      options.monochromatic = 1;
      res.render('editevent', options);
    });
  } else {
    res.send(500);
  }
};

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

exports.deleteevent = function(req, res) {
    var search_options = {'user_id':ObjectId(req.cookies.user_id), '_id':ObjectId(req.query.id)};
    models.Event.find(search_options).remove().exec(function (err, event) {
      if (err) {
        console.log(err);
        res.send(500);
      } else {
        res.redirect('/calendar?eventdeleted=1');
      }
    });
};

exports.getEvents = function(req, res) {
  var search_options = {};
  search_options.user_id = new ObjectId(req.cookies.user_id);
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
