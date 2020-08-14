const UsuarioControle = require('../controllers/usuarios');

module.exports = {

    async createUser(req, res){

        const novoUsuario = await UsuarioControle.create(req, res);
        return novoUsuario;

    }
}