const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const routes = require('./routes')
const basicAuth = require('express-basic-auth');
require('dotenv').config();
require('./config/db-connection');

app.use('/dialogflow', basicAuth({
  users: {'admin': `${process.env.SERVER_PASS}` },
}))
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(routes)

  
// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});

  