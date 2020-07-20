const db = require('../config/db-connection')
const Usuario = require('../models/Usuario');
const Equipe = require('../models/Equipe');
const Doacao = require('../models/Doacao');
const EquipeUsuario = require('../models/EqupeUsuario');

Usuario.hasMany(Doacao);
Doacao.belongsTo(Usuario);
Usuario.hasMany(EquipeUsuario);
Equipe.belongsTo(EquipeUsuario);

db.sync({force: true}).then(() => {console.log(`banco sincronizado`)}).catch(err => {console.error(err)})
