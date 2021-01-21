const express = require('express');
const DialogflowControle = require('./controllers/dialogflow');
const passport = require('passport');
const route = express.Router();
const messageSystem = require('./controllers/messageSystem');
const analytics = require('./controllers/analytics')

function checkAuthentication(req, res, next) {
    if(req.isAuthenticated()) {return next()} else {res.redirect('/login?fail=true')}
}

route.get('/', async (req, res) => {
    const usuarios = await analytics.usuariosTotais();
    const doacoes = await analytics.doacoesTotais();
    const equipes = await analytics.equipesTotais();
    const recorrentes = await analytics.doadoresRescorrentes();
    res.render('index.ejs', {doacoes: doacoes, usuarios: usuarios, equipes: equipes, doadoresRecorrentes: recorrentes});
});

route.get('/login', (req, res) => {
    if(req.query.fail) {
        res.render('login.ejs', {message: "login e senha não encontrados"});
    } else {
        res.render('login.ejs', {message: false});
    }
});

route.post('/login', passport.authenticate('local', { 
    successRedirect: '/painel',
    failureRedirect: '/login?fail=true' 
}));

route.get('/painel', checkAuthentication, async (req, res) => {
    // const plataformas = await messageSystem.findPlataform()
    const estados = await messageSystem.findState()
    const tipos_sanguineos = await messageSystem.findBloodType()
    res.render('painel.ejs',{plataforma: ['telegram'] , estado: estados, tipo_sanguineo: tipos_sanguineos});
});

route.post('/mass_message', checkAuthentication, async (req, res) => {
    
    await messageSystem.sendMessage(req, res);

} )

route.post('/dialogflow', (req, res, next) => {

    console.log(req.body);
    
    const telegramButton = req.body.originalDetectIntentRequest.payload.data.callback_query;
    
    // Detectando plataforma e número de indentificação e ajutando os parametros da requisição

    const sourceTelegram = req.body.originalDetectIntentRequest.source
    const sourceWhatsapp = req.body.originalDetectIntentRequest.payload.source

    if(telegramButton === undefined){

        // verifica se a mensagem foi enviada por um botão do telegram

        var idPlataforma = req.body.originalDetectIntentRequest.payload.data.from.id;

    } else {

        var idPlataforma = req.body.originalDetectIntentRequest.payload.data.callback_query.from.id;

    }

    if (sourceTelegram == '' || sourceTelegram === null || sourceTelegram === undefined){

        // armazenando o whatsapp como plataforma e o numero do celular como celular

        req.body.queryResult.parameters.plataforma = sourceWhatsapp;
        //req.body.queryResult.parameters.celular = idPlataforma;

    } else {

        // armazenando o telegram como plataforma e o id como celular
        req.body.queryResult.parameters.plataforma = sourceTelegram;
        req.body.queryResult.parameters.celular = idPlataforma; 
    }
    next();
    
})

route.post('/dialogflow', DialogflowControle.checkIntent)


module.exports = route;