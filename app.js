var express = require('express');
var path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var exphbs  = require('express-handlebars');

const port =  9010;
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');


var app = express();

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use(session({
    secret: process.env.SESSION_SECRET || 'dev',
    resave: false,
    saveUninitialized: true,
  }));

app.use(logger('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.set('json spaces', 2);
app.enable('trust proxy');
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
module.exports = app;
