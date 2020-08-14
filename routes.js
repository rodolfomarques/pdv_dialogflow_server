const express = require('express');
const DialogflowControle = require('./controllers/dialogflow');
const route = express.Router();


route.get('/', (req, res) => {
    res.send('Silence is gold')
})


route.post('/dialogflow', (req, res, next) => {

    console.log(req.body);

    next();
    
})

route.post('/dialogflow', DialogflowControle.checkIntent)


module.exports = route;