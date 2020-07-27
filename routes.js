const express = require('express');
const UsuarioControle = require('./controllers/usuarios');
const DoacaoControle = require('./controllers/doacoes');
const EquipeControle = require('./controllers/equipe');
const EquipeUsuarioControle = require('./controllers/equipeUsuario');
const route = express.Router()


route.get('/', (req, res) => {
    res.send('Silence is gold')
})

route.post('/test', EquipeUsuarioControle.select)

module.exports = route;