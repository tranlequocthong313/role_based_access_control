const express = require('express');
const createError = require('http-errors');
const morgan = require('morgan');
require('dotenv').config();

require('./helpers/init_mongodb');

const session = require('express-session');
const connectFlash = require('connect-flash');
const passport = require('passport');
const { default: mongoose } = require('mongoose');
const MongoStore = require('connect-mongo');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'));
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(session({
  store: MongoStore.create({ mongoUrl: `${process.env.MONGO_URI}/${process.env.MONGO_DB_NAME}` }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true
  },
}));

app.use(passport.initialize());
app.use(passport.session());
require('./helpers/passport_auth');

app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

app.use(connectFlash());
app.use((req, res, next) => {
  res.locals.messages = req.flash();
  next();
});

app.use('/', require('./routes/index.route'));

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.render('error_40x', { error });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`🚀 @ http://localhost:${PORT}`));

