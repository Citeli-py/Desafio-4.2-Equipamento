import { Model, DataTypes } from 'sequelize';

export class Bicicleta extends Model {

  static init(sequelize){
    super.init({
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        marca: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        modelo: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        ano: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        numero: {
          type: DataTypes.STRING,
          unique: true,
          allowNull: false,
        },
        status: {
          type: DataTypes.STRING,
          allowNull: false,
          defaultValue: 'disponível', // Exemplos: 'disponível', 'alugada', 'manutenção'
        },
      },
      {
        sequelize,
        modelName: 'Bicicleta',
        tableName: 'bicicletas',
      }
    );  
  }
};
