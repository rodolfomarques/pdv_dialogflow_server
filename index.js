const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const routes = require('./routes')
const basicAuth = require('express-basic-auth');
require('dotenv').config();
require('./config/db-connection');
require('./controllers/telegram')

//Variáveis para o envio de mensagens do servidor para o bot

require('./controllers/cron');

// Middlewares do Express

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(routes)
app.use('/dialogflow', basicAuth({
  users: {'admin': `${process.env.SERVER_PASS}` },
}))

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});

  