import { Model, DataTypes } from 'sequelize';

export class Retirada extends Model {

  static init(sequelize){
    super.init({
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        
      },
      {
        sequelize,
        modelName: 'Retirada',
        tableName: 'retiradas',
        timestamps: false,
      }
    );  
  }
};
