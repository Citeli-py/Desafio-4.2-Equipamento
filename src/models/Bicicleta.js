import { Model, DataTypes } from 'sequelize';
import { Op, ValidationError } from 'sequelize';

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
          type: DataTypes.STRING,
          allowNull: false,
        },
        numero: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        status: {
          type: DataTypes.STRING,
          allowNull: false,
          defaultValue: 'NOVA', // Exemplos: 'DISPONIVEL','EM_USO', 'NOVA', 'APOSENTADA', 'REPARO_SOLICITADO', 'EM_REPARO'
        },
      },
      {
        sequelize,
        modelName: 'Bicicleta',
        tableName: 'bicicletas',
        timestamps: false,
      }
    );  
  }

  static associate(models) {
    this.hasOne(models.Tranca, {foreignKey: "bicicleta", sourceKey: 'bicicleta', as: 'tranca'});
  }
};
