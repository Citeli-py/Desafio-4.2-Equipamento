import { Model, DataTypes } from 'sequelize';

export class Totem extends Model {

  static init(sequelize) {
    super.init({
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      localizacao: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      descricao: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'Totem',
      tableName: 'totens',
      timestamps: false,
    });
  }
};