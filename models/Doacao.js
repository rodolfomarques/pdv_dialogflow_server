const {Model, DataTypes} = require('sequelize');


class Doacao extends Model {
    static init(sequelize) {
        super.init({
            id_usuario: DataTypes.INTEGER,
            data: DataTypes.DATEONLY,
            local: DataTypes.STRING
        },{
            sequelize,
            tableName: 'doacoes'
        })
    }

    static associate(models){
        this.belongsTo(models.Usuario, {foreignKey: 'id', as: 'doador'})
    }
}

module.exports = Doacao;