const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const routes = require('./routes')
const basicAuth = require('express-basic-auth');
const passport = require("passport");
const cookieParser = require('cookie-parser')();
const session = require('express-session')
require('dotenv').config();
require('./config/db-connection');
require('./controllers/telegram')
require('./config/local-strategy')(passport);

//Variáveis para o envio de mensagens do servidor para o bot

require('./controllers/cron');

// Middlewares do Express

app.use('/dialogflow', basicAuth({
  users: {'admin': `${process.env.SERVER_PASS}` },
}));

app.use(session({ 
  secret: process.env.SESSIONKEY,
  resave: false,
  saveUninitialized: false,
  cookie: {maxAge:30 * 60 * 1000}
}));
//app.use(express.static('public'));
app.use("/public", express.static('./public/'));
app.use(cookieParser);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(routes)
app.set('view engine', 'ejs');

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});

  