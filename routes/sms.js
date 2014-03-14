var models = require('../models');
var ObjectId = require('mongoose').Types.ObjectId;
var exec = require('child_process').exec;

exports.sendText = function(req, res) {
    var number = req.query.number;
    var message = req.query.message;

    sendTextMessage(number, message);
    res.send(200);
};

function sendTextMessage(number, message) {
  var currdirarr = __dirname.split("/");
  currdirarr[currdirarr.length-1] = "scripts";
  currdirarr.push("sendText.py");
  var scriptfile = currdirarr.join("/");

  var command = 'python ' + scriptfile + ' ' + number + ' "' + message + '"';
  console.log('Sending text using command: [' + command + ']');
  exec(command);
};

// Sends notifications to all users who have signed up for
// notifications for the given type
exports.notifyAll = function(req, res) {
  if (req.query.password === 'admin' && req.query.type != undefined) {
    var search_params = {};
    if (req.query.type === 'food' || req.query.type === 'sleep'
        || req.query.type === 'exercise') {
      search_params[req.query.type] = true;
      var message = getMessageOfType(req.query.type);
      models.Settings.find(search_params, function(err, settings) {
        for (var i = 0; i < settings.length; i++) {
          var user_id = settings[i].user_id;
          notifyUser(user_id, message);
        }
        res.send(200);
      });
    } else {
      res.send(500);
    }
  } else {
    res.send(500);
  }
};

var tips = require('../tips.json');
function getMessageOfType(type) {
  var prettytype = '';
  if (type === 'food') prettytype = 'Eating';
  if (type === 'sleep') prettytype = 'Sleep';
  if (type === 'exercise') prettytype = 'Exercise';

  var tipsForType = tips.healthtips[type];
  var randIndex = Math.floor(Math.random() * tipsForType.length);
  return '[' + prettytype + ' tip] ' + tipsForType[randIndex];
};

//Send a text to the user with the given user_id
function notifyUser(user_id, message) {
  //get this user's phone number
  var search_params = { 'user_id':user_id, 'phone':{$gt:1} };
  models.Settings.findOne(search_params, function(err, settings) {
    if (settings != null) {
      var number = settings.phone;
      sendTextMessage(number, message);
    }
  });
};
