import { Model, DataTypes } from 'sequelize';
import { Bicicleta } from './Bicicleta';  

export class Tranca extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        numero: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        localizacao: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        anoDeFabricacao: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        modelo: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        status: {
          type: DataTypes.STRING,
          allowNull: false,
          defaultValue: 'disponível',  
        },
        bicicletaId: {  
          type: DataTypes.INTEGER,
          references: {
            model: Bicicleta,
            key: 'id',
          },
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: 'Tranca',
        tableName: 'trancas',  
        timestamps: false,  
      }
    );
  }

  
  static associate(models) {
    this.belongsTo(models.Bicicleta, { foreignKey: 'bicicletaId', as: 'bicicleta' });
  }
}

export default Tranca;
