var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// önce vt bağlantısı olmalı ona göre yönlendirilmeli
require('./app_api/models/db');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var apiRoutes=require("./app_api/routes/index");

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use("/api", apiRoutes);
app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;
