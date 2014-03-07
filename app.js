var express = require('express');
var http = require('http');
var path = require('path');
var handlebars = require('express3-handlebars');
var mongoose = require('mongoose');

var signin = require('./routes/signin');
var index = require('./routes/index');
var help = require('./routes/help');
var settings = require('./routes/settings');
var events = require('./routes/events');
var colors = require('./routes/colors');
var sms = require('./routes/sms');

// Connect to the Mongo database, whether locally or on Heroku
var local_database_name = 'CriSee';
var local_database_uri  = 'mongodb://localhost/' + local_database_name;
var database_uri = process.env.MONGOLAB_URI || local_database_uri;
mongoose.connect(database_uri);

var app = express();

// all environments
app.set('port', process.env.PORT || 8000);
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', handlebars());
app.set('view engine', 'handlebars');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// Add routes here
app.get('/', index.view);
app.get('/signin', signin.viewSignin);
app.post('/signin', signin.signin);
app.get('/signup', signin.viewSignup);
app.post('/signup', signin.signup);
app.get('/signout', signin.signout);
app.get('/calendar', index.calendarview);
app.get('/list', index.listview);
app.get('/help', help.view);
app.get('/settings', settings.view);
app.get('/addevent', events.viewAddevent);
app.post('/addevent', events.addevent);
app.get('/editevent', events.viewEditevent);
app.post('/editevent', events.editevent);
app.get('/events', events.getEvents);
app.get('/colors', colors.getColors);
app.get('/delete', events.deleteevent);
app.get('/sms', sms.sendText);
// not yet implemented
//app.get('/search', );

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
