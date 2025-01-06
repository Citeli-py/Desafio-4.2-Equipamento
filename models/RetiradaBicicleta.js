import { Model, DataTypes } from 'sequelize';
import { Bicicleta } from './Bicicleta.js';
import { DateTime } from 'luxon';

export class RetiradaBicicleta extends Model {

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
        modelName: 'RetiradaBicicleta',
        tableName: 'retiradasBicicleta',
        timestamps: false,
      }
    );  
  }
};
