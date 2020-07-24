const {Model, DataTypes} = require('sequelize');


class EquipeUsuario extends Model {
    static init(sequelize){
        super.init({
            id_usuario: DataTypes.INTEGER,
            id_equipe: DataTypes.INTEGER,
            moderador: DataTypes.BOOLEAN
        },{
            sequelize
        })
    }
}

module.exports = EquipeUsuario;