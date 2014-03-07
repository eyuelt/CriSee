var exec = require('child_process').exec;

exports.sendText = function(req, res) {
  var number = req.query.number;
  var message = req.query.message;

  var currdirarr = __dirname.split("/");
  currdirarr[currdirarr.length-1] = "scripts";
  currdirarr.push("sendText.py");
  var scriptfile = currdirarr.join("/");

  var command = 'python ' + scriptfile + ' ' + number + ' "' + message + '"';
  console.log('Sending text using command: [' + command + ']');
  exec(command);

  res.send(200);
};
