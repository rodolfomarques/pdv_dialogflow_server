const express = require('express');
const UsuarioControle = require('./controllers/usuarios');
const DoacaoControle = require('./controllers/doacoes');
const route = express.Router()


route.get('/', (req, res) => {
    res.send('Silence is gold')
})

route.post('/test', DoacaoControle.create)

module.exports = route;