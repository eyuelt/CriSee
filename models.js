var Mongoose = require('mongoose');

var UserSchema = new Mongoose.Schema({
  "username": String,
  "password": String
});

var EventSchema = new Mongoose.Schema({
  //"user_id": User,
  "description": String,
  "deadline": Date,
  "difficulty": Number
});

exports.User = Mongoose.model('User', UserSchema);
exports.Event = Mongoose.model('Event', EventSchema);
