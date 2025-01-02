import { Model, DataTypes } from 'sequelize';

export class Inclusao extends Model {

  static init(sequelize){
    super.init({
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },

        idTranca: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        idBicicleta: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        idFuncionario: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        numeroBicicleta: {
          type: DataTypes.INTEGER,
          allowNull: false
        },

        numeroTranca: {
          type: DataTypes.INTEGER,
          allowNull: false
        },

        dataHora: {
          type: DataTypes.DATE,
          allowNull: false,
        }
        
      },
      {
        sequelize,
        modelName: 'Inclusao',
        tableName: 'inclusoes',
        timestamps: false,
      }
    );  
  }

  // static associate(models){
  //   this.belongsTo(models.Bicicleta, { foreignKey: 'id', as: 'bicicleta' });
  // }
};