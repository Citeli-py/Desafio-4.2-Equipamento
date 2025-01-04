import { Model, DataTypes } from 'sequelize';

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
        modelName: 'Retirada',
        tableName: 'retiradas',
        timestamps: false,
      }
    );  
  }


  static async criarRetirada(bicicleta, funcionario){
    await Retirada.create({
        numeroBicicleta: bicicleta.numero,
        matriculaFuncionario: funcionario.matricula,
        dataHora: DateTime.now().toSQL()
    });
  } 
};
