var express = require('express');
var http = require('http');
var path = require('path');
var handlebars = require('express3-handlebars');
var signup = require('./routes/signup');
var index = require('./routes/index');
var signin = require('./routes/signin');
var error = require('./routes/error');
var calendar = require('./routes/calendar');
var help = require('./routes/help');
var settings = require('./routes/settings');
var addevent = require('./routes/addevent');
var events = require('./routes/events');

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
app.get('/signin', signin.view);
app.post('/signin', signin.login);
app.get('/signup', signup.view);
app.post('/signup', signup.signup);
app.get('/logout', signin.logout);
app.get('/calendar', index.calendarview);
app.get('/list', index.listview);
app.get('/help', help.view);
app.get('/settings', settings.view);
app.get('/addevent', addevent.view);
app.get('/events', events.getEvents);
// not yet implemented
app.get('/reminders', error.notCreated);
app.get('/search', error.notCreated);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
