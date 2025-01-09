import { Model, DataTypes } from 'sequelize';

export class RetiradaTranca extends Model {

  static init(sequelize){
    super.init({
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },

        numeroTranca: {
          type: DataTypes.INTEGER,
          allowNull: false
        },

        matriculaReparador: {
          type: DataTypes.STRING,
          allowNull: false
        },

        dataHora: {
          type: DataTypes.DATE,
          allowNull: false
        }
        
      },
      {
        sequelize,
        modelName: 'RetiradaTranca',
        tableName: 'retiradasTranca',
        timestamps: false,
      }
    );  
  }
};
