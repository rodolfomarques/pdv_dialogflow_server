const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const routes = require('./routes')
require('dotenv').config();
require('./config/db-connection');

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(routes)

app.post("/dialogflow", (req, res) => {

    var intentName = req.body.queryResult.intent.displayName;
    
    if (intentName == "welcome"){
      
      console.log (req.body)
      res.json({fulfillmentText: "Estou enviando esse olá do servidor local"});
      
    }
  
    if (intentName == "logar") {
      
      console.log('usuário tenta logar')
      
      var user = req.body.queryResult.outputContexts[0].parameters.user_number;
      var pass = req.body.queryResult.outputContexts[0].parameters.senha;
      var retorno;
      
    }
    
    if (intentName == "ultima_doacao") {
      
      console.log (req.body)
      
      var user = req.body.queryResult.outputContexts[0].parameters.user_number;
      var pass = req.body.queryResult.outputContexts[0].parameters.senha;
      var retorno;
      
      
    }
    
    if (intentName == "tempo_restante") {
      
      var user = req.body.queryResult.outputContexts[0].parameters.user_number;
      var pass = req.body.queryResult.outputContexts[0].parameters.senha;
      var retorno;
            
    }
  });
  
  // listen for requests :)
  const listener = app.listen(process.env.PORT, () => {
    console.log("Your app is listening on port " + listener.address().port);
  });

  