import { Model, DataTypes } from 'sequelize';
import { DateTime } from 'luxon';
import { Bicicleta } from './Bicicleta.js';
import Tranca from './Tranca.js';

export class InclusaoBicicleta extends Model {

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
        modelName: 'InclusaoBicicleta',
        tableName: 'inclusoesBicicleta',
        timestamps: false,
      }
    );  
  }
};
