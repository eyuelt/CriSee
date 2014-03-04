/*
  This script will initialize a local Mongo database
  on your machine so you can do development work.
  This script will create a local Mongo database on your
  machine if it doesn't already exist. If it does, it will
  clear the User and Event objects from it.
*/

var mongoose = require('mongoose');
var models   = require('./models');

// Connect to the Mongo database, whether locally or on Heroku
var local_database_name = 'CriSee';
var local_database_uri  = 'mongodb://localhost/' + local_database_name
var database_uri = process.env.MONGOLAB_URI || local_database_uri
mongoose.connect(database_uri);

// Remove all users
models.User
  .find()
  .remove()
  .exec();

// Remove all events
models.Event
  .find()
  .remove()
  .exec();
