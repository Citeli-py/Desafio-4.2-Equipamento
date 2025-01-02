import { Model, DataTypes } from 'sequelize';
import { Bicicleta } from './Bicicleta.js';  

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
          defaultValue: 'NOVA',  // 'LIVRE', 'OCUPADA', 'NOVA', 'APOSENTADA', 'EM_REPARO'
        },
        bicicleta: {  
          type: DataTypes.INTEGER,
          references: {
            model: Bicicleta,
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

  /**
   * Esse metodo tranca a Tranca, alterando seu status para OCUPADA e associando uma bicicleta a ela, 
   * essa bicicleta tem seu status trocado para disponível
   * @param {Bicicleta} bicicleta  - Bicicleta que sera presa na tranca
   */
  async trancar(bicicleta=null){
    
    if (bicicleta){
      this.bicicleta = bicicleta.id;
      bicicleta.status = "DISPONIVEL";
      await bicicleta.save();
    }
    
    this.status = "OCUPADA";
    await this.save();
  }
  
  static associate(models) {
    this.belongsTo(models.Bicicleta, { foreignKey: 'bicicleta', as: 'bicicleta' });
  }
}

export default Tranca;
