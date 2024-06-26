const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const handlebars = require('express-handlebars');
const session = require('express-session');
const history = require('connect-history-api-fallback');
require('dotenv').config();

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const freetsRouter = require('./routes/freets');
const sessionRouter = require('./routes/session');

const app = express();

// production flag
const isProduction = process.env.NODE_ENV === 'production';

// Use handlebars as template engine
app.engine('html', handlebars({extname: '.html', defaultLayout: false}));
app.set('view engine', 'html');
app.set('views', isProduction ? './dist' : './public');

// Set up user session
app.use(session({
    secret: 'URL-shortener',
    resave: true,
    saveUninitialized: true
  }));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(history());
app.use(express.static(path.join(__dirname, isProduction ? 'dist' : 'public')));

app.use('/', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/freets', freetsRouter);
app.use('/api/session', sessionRouter);

// Catch all other routes into a meaningful error message
app.all('*', (req, res) => {
    const errorMessage = `
      Cannot find the resource <b>${req.url}</b>
      <br>
      Please use only supported routes below
      <br><br>
      <b>Home Page</b>
      <br>
      GET / -- Go to home page
      <br><br>
      <b>Authentication</b>
      <br>
      POST /api/session -- Login to a user account
      <br>
      DELETE /api/session -- Logout of a user account
      <br><br>
      <b>Users</b>
      <br>
      POST /api/users -- Create and store a new user on the server
      <br>
      PUT /api/users/:username/edit -- Update the user's username to :username on the server
      <br>
      PUT /api/users/ -- Update the user's password on the server
      <br>
      DELETE /api/users -- Delete the logged in user on the server
      <br><br>
      <b>Freets</b>
      <br>
      GET /api/freets -- Display all freets stored on the server
      <br>
      POST /api/freets -- Create and store a new freet on the server
      <br>
      PUT /api/freets/:id -- Update a freet on the server
      <br>
      DELETE /api/freets/:id? -- Delete the freet on the server with ID :id
      <br>
      GET /api/freets/:author? -- Display all freets by the author with username :author
    `;
  
    res.status(404).send(errorMessage);
  });

module.exports = app;
