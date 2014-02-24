var Mongoose = require('mongoose');

var UserSchema = new Mongoose.Schema({
  "username": String,
  "salt": String,
  "key": String
});

var EventSchema = new Mongoose.Schema({
  "user_id": {type: Mongoose.Schema.ObjectId, ref:'UserSchema'},
  "description": String,
  "deadline": Date,
  "difficulty": Number
});

exports.User = Mongoose.model('User', UserSchema);
exports.Event = Mongoose.model('Event', EventSchema);
