const {Model} = require('sequelize');
const {DataTypes} = require('sequelize');

class Usuario extends Model {
    static init(sequelize){
        super.init({
            nome: DataTypes.STRING,
            email: DataTypes.STRING,
            celular: DataTypes.BIGINT(13),
            plataforma: DataTypes.STRING,
            data_nascimento: DataTypes.DATEONLY,
            sexo: DataTypes.STRING,
            tipo_sanguineo: DataTypes.STRING,
            privacidade: DataTypes.BOOLEAN,
            nivel: DataTypes.INTEGER
        },{
            sequelize
        })
    }

    static associate(models){
        this.hasMany(models.Doacao, {foreignKey: 'id_usuario', as: 'doacoes'});
        this.belongsToMany(models.Equipe, {
            through: 'EquipeUsuario',
            foreignKey: 'id_usuario',
            as: 'participante'
        })
    }
}


module.exports = Usuario;