var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var hbs = require('express-handlebars');
var fileUpload = require("express-fileupload");
var db = require("./config/connection");
var session = require('express-session');
const favicon = require('serve-favicon');

var userRouter = require('./routes/user');
var adminRouter = require('./routes/admin');

var app = express();

// var hbsInstance = hbs.create({
//   extname: "hbs",
//   defaultLayout: "layout",
//   layoutsDir: path.join(__dirname, 'views', 'layout'),
//   partialsDir: path.join(__dirname, 'views', 'partials
// });

const hbsInstance = hbs.create({
  extname: "hbs",
  defaultLayout: "layout",
  layoutsDir: path.join(__dirname, 'views', 'layout'),
  partialsDir: path.join(__dirname, 'views', 'partials'),
  helpers: {
    // Custom Handlebars helper: ifCond
    ifCond: function (v1, operator, v2, options) {
      switch (operator) {
        case '===':
          return v1 === v2 ? options.fn(this) : options.inverse(this);
        case '!==':
          return v1 !== v2 ? options.fn(this) : options.inverse(this);
        case '<':
          return v1 < v2 ? options.fn(this) : options.inverse(this);
        case '<=':
          return v1 <= v2 ? options.fn(this) : options.inverse(this);
        case '>':
          return v1 > v2 ? options.fn(this) : options.inverse(this);
        case '>=':
          return v1 >= v2 ? options.fn(this) : options.inverse(this);
        case 'includes':
          if (Array.isArray(v1)) {
            return v1.includes(v2) ? options.fn(this) : options.inverse(this);
          } else if (typeof v1 === 'string') {
            return v1.includes(v2) ? options.fn(this) : options.inverse(this);
          }
          return options.inverse(this);
        default:
          return options.inverse(this);
      }
    },
    // Custom Handlebars helper: unlessCond
    unlessCond: function (v1, operator, v2, options) {
      switch (operator) {
        case '===':
          return v1 !== v2 ? options.fn(this) : options.inverse(this);
        case '!==':
          return v1 === v2 ? options.fn(this) : options.inverse(this);
        case '<':
          return v1 >= v2 ? options.fn(this) : options.inverse(this);
        case '<=':
          return v1 > v2 ? options.fn(this) : options.inverse(this);
        case '>':
          return v1 <= v2 ? options.fn(this) : options.inverse(this);
        case '>=':
          return v1 < v2 ? options.fn(this) : options.inverse(this);
        case 'includes':
          if (Array.isArray(v1)) {
            return v1.includes(v2) ? options.inverse(this) : options.fn(this);
          } else if (typeof v1 === 'string') {
            return v1.includes(v2) ? options.inverse(this) : options.fn(this);
          }
          return options.inverse(this);
        default:
          return options.inverse(this);
      }
    }
  }
});




// view engine setup
app.engine('hbs', hbsInstance.engine);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// app.engine('hbs', hbs.engine({
//   extname:"hbs", 
//   defaultLayout:"layout", 
//   layoutsDir:__dirname+"/views/layout/", 
//   partialsDir:__dirname+"/views/partials/"
// }))

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public','images', 'favicon.ico')));
app.use(fileUpload());
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
}));

db.connect((err)=>{
  if(err){
    console.log("Connection error");
  }else{
    console.log("Connected to DB");
  }
})

app.use('/', userRouter);
app.use('/admin', adminRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
