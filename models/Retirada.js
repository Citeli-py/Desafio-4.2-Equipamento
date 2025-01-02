import { Model, DataTypes } from 'sequelize';

export class Retirada extends Model {

  static init(sequelize){
    super.init({
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },

        numeroBicicleta: {
          type: DataTypes.INTEGER,
          allowNull: false
        },

        matriculaFuncionario: {
          type: DataTypes.INTEGER,
          allowNull: false
        },

        dataHora: {
          type: DataTypes.DATE,
          allowNull: false
        }
        
      },
      {
        sequelize,
        modelName: 'Retirada',
        tableName: 'retiradas',
        timestamps: false,
      }
    );  
  }
};
