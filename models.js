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

var SettingsSchema = new Mongoose.Schema({
  "reminders": Boolean,
  "food": Boolean,
  "sleep": Boolean,
  "exercise": Boolean,
  "phone": Number
}):

exports.User = Mongoose.model('User', UserSchema);
exports.Event = Mongoose.model('Event', EventSchema);
exports.Settings = Mongoose.model('Settings', SettingsSchema);
