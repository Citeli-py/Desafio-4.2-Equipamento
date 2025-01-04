import { Model, DataTypes } from 'sequelize';
import { DateTime } from 'luxon';
import { Bicicleta } from './Bicicleta';
import Tranca from './Tranca';

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
        modelName: 'Inclusao',
        tableName: 'inclusoes',
        timestamps: false,
      }
    );  
  }

  /**
   * 
   * @param {Bicicleta} bicicleta 
   * @param {Tranca} tranca 
   */
  static async criarInclusao(bicicleta, tranca){
    await Inclusao.create({
        numeroBicicleta: bicicleta.numero,
        numeroTranca: tranca.numero,
        dataHora: DateTime.now().toSQL()
    });
  }
};
