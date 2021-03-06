var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var sassMiddleware = require('node-sass-middleware');
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var UserManager = require('./utils/user-manager');
var FlashMessages = require('./utils/flash-messages');

var indexRouter = require('./routes/index');
var projectsRouter = require('./routes/projects');
var milestonesRouter = require('./routes/milestones');
var usersRouter = require('./routes/users');

var app = express();

// mongoose setup
mongoose.connect('mongodb://localhost/test');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));

// session setup
var sess = {
  secret: 'secret key', // TODO: make this correct
  resave: false, // don't save session if unmodified
  saveUninitialized: false, // dont' create session until needed
  cookie: {},
  store: new MongoStore({ 
    mongooseConnection: db, // use existing connect
    autoRemove: 'interval',
    autoRemoveInterval: 60  // minutes
  })
};
if (app.get('env' === 'production')) {
  // In prod set these options
  app.set('trust proxy', 1);
  sess.cookie.secure = true;
}
app.use(session(sess));

// add middlewear for handling users and flash messages
app.use(function (req, res, next) {
  var userManager = new UserManager(req.session);
  req.userManager = userManager;

  var flashMessages = new FlashMessages(req.session);
  res.flashMessages = flashMessages;

  // make these available in views
  app.locals.userManager = userManager;
  app.locals.user = userManager.user();
  app.locals.loggedIn = userManager.loggedIn();
  app.locals.flashMessages = flashMessages;

  next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true, // true = .sass and false = .scss
  sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/projects', projectsRouter);
app.use('/milestones', milestonesRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// configure development mode
var env = process.env.NODE_ENV || 'development';
if ('development' == env) {
  app.locals.pretty = true; // Stop express minifying HTML
}

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
