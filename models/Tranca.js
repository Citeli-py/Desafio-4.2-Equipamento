import { Model, DataTypes } from 'sequelize';

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
          defaultValue: 'NOVA',
        },
        bicicleta: {  
          type: DataTypes.INTEGER,
          references: {
            model: 'bicicletas', // Nome da tabela
            key: 'id',
          },
          allowNull: true,
        },
        idTotem: {  
          type: DataTypes.INTEGER,
          references: {
            model: 'totens', // Nome da tabela
            key: 'id',
          },
          allowNull: true,
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
    this.belongsTo(models.Bicicleta, { foreignKey: 'bicicleta', as: 'bicicleta' });
    this.belongsTo(models.Totem, { foreignKey: 'idTotem', as: 'totem' });
  }
}
