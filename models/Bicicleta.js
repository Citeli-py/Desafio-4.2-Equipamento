import { Model, DataTypes } from 'sequelize';
import { Op } from 'sequelize';

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

  /**
   * Metodo que pega todas as bicicletas e lida com softdelete
   * 
   * @async
   * @returns {Promise<Bicicleta[]>} - Todas as bicicletas disponiveis
   */
  static async getAllBicicletas(){
    return await this.findAll({where: {status: {[Op.ne]: "EXCLUIDA"}}});
  }

  /**
   * @async
   * @param {number} id - id da bicicleta
   * @returns {Promise<Bicicleta>} - Bicicleta com o id informado
   */
  static async getBicicleta(id){
    return await this.findByPk(id, {
      where: {
          status: {
              [Op.ne]: "EXCLUIDA"
          }
      }
    });
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
