const express = require('express');
const DialogflowControle = require('./controllers/dialogflow');
const route = express.Router();

route.get('/', (req, res) => {
    res.send('Silence is gold')
})

route.post('/dialogflow', (req, res, next) => {

    // Detectando plataforma e número de indentificação e ajutando os parametros da requisição

    const sourceTelegram = req.body.originalDetectIntentRequest.source
    const sourceWhatsapp = req.body.originalDetectIntentRequest.payload.source
    const idPlataforma = req.body.originalDetectIntentRequest.payload.data.from.id
    if (sourceTelegram == '' || sourceTelegram === null || sourceTelegram === undefined){

        // armazenando o whatsapp como plataforma e o numero do celular como celular

        req.body.queryResult.parameters.plataforma = sourceWhatsapp;
        req.body.queryResult.parameters.celular = idPlataforma;

    } else {

        // armazenando o whatsapp como plataforma e o id como celular
        req.body.queryResult.parameters.plataforma = sourceTelegram;
        req.body.queryResult.parameters.celular = idPlataforma; 
    }
    next();
    
})

route.post('/dialogflow', DialogflowControle.checkIntent)


module.exports = route;