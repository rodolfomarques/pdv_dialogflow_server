const {Model, DataTypes} = require('sequelize');


class Equipe extends Model {
    static init(sequelize){
        super.init({
            nome: DataTypes.STRING,
            descricao: DataTypes.TEXT
        },{
            sequelize
        })
    }

    static associate(models){
        this.belongsToMany(models.Usuario, {
            through: "EquipeUsuario",
            foreignKey: 'id_equipe',
            as: 'participantes'
        })
    }
}
 
module.exports = Equipe;