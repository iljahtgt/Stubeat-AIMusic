var express = require("express");
var cors = require("cors");
var bodyParser = require("body-parser");
var sqlService = require("./api/sqlService.js");


var port = process.env.PORT || 1337;

// var session = require('express-session');
// var cookieParser = require('cookie-parser');
// var passport = require('passport');
// var cookieSession = require('cookie-session');
// var morgan = require('morgan');
// var flash = require('connect-flash');
var cors = require('cors');

// passport api


var app = express();
// require('./config/passport')(passport);
// turn the data from request into json format

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cors());
// app.use(flash());



// app.use(morgan('dev'));
// app.use(cookieParser());

// app.use(cookieSession({
//     name: 'Stubeat-session',
//     keys: ['key1', 'key2']
// }))

// 需要擺在passport.session之前確保有設定好的session給passport.session用
// app.use(session({
//     secret: 'cat',
//     resave: true,
//     saveUninitialized: true
// }));

// app.use(passport.initialize());
// app.use(passport.session());



//=====================================

app.use("/api", sqlService);

//=====================================



app.listen(port);
console.log(`Server is listening on port ${port}`);