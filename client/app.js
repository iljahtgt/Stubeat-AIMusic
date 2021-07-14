var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
// var session = require('express-session');
// var cookieParser = require('cookie-parser');
// const passport = require('passport');
// var cookieSession = require('cookie-session');
// var morgan = require('morgan');
// var flash = require('connect-flash');
var cors = require('cors');
require('dotenv').config();

var port = process.env.PORT || 3000;

var routes = require('./routes/index.js');
var music = require('./routes/music.js');
var account = require('./routes/account.js');


var app = express();
app.use(cors());
// require('./config/passport')(passport);


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


// set view engine and static directory
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

// set up body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// app.use(passport.initialize());
// app.use(passport.session());

// app.use(flash());
// require('./routes/account.js')(app, passport);



// routing
app.use('/', routes);
app.use('/music', music);
app.use('/account', account);




app.listen(port);
console.log(`Listening on port ${port}`);


module.exports = app;
