var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var indexViews = require('./routes/views/index');
var accountApi = require('./routes/api/account');
var employeeApi = require('./routes/api/employee');
var customerApi = require('./routes/api/customer');
var consultancyApi = require('./routes/api/consultancy');
var studyApi = require('./routes/api/study');
var seminarApi = require('./routes/api/seminar');

var app = express();

mongoose.connect('mongodb://localhost/document_manager');
//mongoose.connect('mongodb://buiduykhoi:buiduykhoi@ds149763.mlab.com:49763/document_manager');

// view engine setup
app.set('views', path.join(__dirname, 'views'));

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/data',express.static(path.join(__dirname, 'data')));
app.use('/views',express.static(path.join(__dirname, 'views')));
app.use('/lib',express.static(path.join(__dirname, 'bower_components')));
app.use('/assets',express.static(path.join(__dirname, 'public')));

app.use('/', indexViews);
app.use('/api/accounts', accountApi);
app.use('/api/employees', employeeApi);
app.use('/api/customers', customerApi);
app.use('/api/consultancies', consultancyApi);
app.use('/api/studies', studyApi);
app.use('/api/seminars', seminarApi);


module.exports = app;
