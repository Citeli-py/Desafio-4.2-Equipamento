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

  // Não retira o a bicicleta do banco de dados mas ela não deve mais aparecer caso seja pesquisada
  softDelete(){
    this.status = "EXCLUIDA";
  }

  // Verifica se a bicicleta foi excluida
  isExcluida(){
    return this.status === "EXCLUIDA";
  }

  // Verifica se a bicicleta está aposentada
  isAposentada(){
    return this.status === "APOSENTADA";
  }
};
