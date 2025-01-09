import { Model, DataTypes } from 'sequelize';

export class InclusaoTranca extends Model {

  static init(sequelize){
    super.init({
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },

        matriculaReparador: {
          type: DataTypes.STRING,
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
        modelName: 'InclusaoTranca',
        tableName: 'inclusoesTranca',
        timestamps: false,
      }
    );  
  }
};
