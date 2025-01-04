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
   * Obtem um bicicleta pelo seu ID
   * 
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

  /**
   * Trata os erros das operações com o BD
   * 
   * @param {Error} error - Erro dado pela operação
   * @returns {sucesso: boolean, mensagem?: string} - Retorna um erro com uma mensagem
   */
  static #tratarErros(error){
    //Expandir caso necessário 
    if(typeof error === ValidationError)
      return {sucesso: false};

    return {sucesso: false};
  }

  /**
   * Metodo para criar uma nova bicicleta
   * 
   * @param {string} marca - Marca da bicicleta
   * @param {string} modelo - Modelo da Bicicleta
   * @param {string} ano - Ano de fabricação da bicicleta
   * @param {number} numero - Numero do RFID da bicicleta
   * @returns {{sucesso: boolean, bicicleta?: Bicicleta}} - Retorna sucesso: true caso a bicicleta tenha sido criada, se não retorna um erro
   */
  static async criarBicicleta(marca, modelo, ano, numero){
    try{
      const bicicleta = await Bicicleta.create({marca, modelo, ano, numero, status: "NOVA"});
      return {sucesso: true, bicicleta};

    } catch(error){
      return Bicicleta.#tratarErros(error);
    }
  }

  /**
   * Metodo para atualizar uma bicicleta
   * 
   * @param {string} marca - Marca da bicicleta
   * @param {string} modelo - Modelo da Bicicleta
   * @param {string} ano - Ano de fabricação da bicicleta
   * @returns {{sucesso: boolean, bicicleta?: Bicicleta}} - Retorna sucesso: true caso a bicicleta tenha sido atuizada, se não retorna um erro
   */
  async atualizaBicicleta(marca, modelo, ano){
    try{
      const bicicleta = await this.update({marca, modelo, ano});
      return {sucesso: true, bicicleta};

    } catch(error){
      return Bicicleta.#tratarErros(error);
    }
  }

  /**
   * Altera o status de uma bicicleta
   * 
   * @param {string} novoStatus 
   * @returns {boolean} - Retorna verdadeiro se foi possivel alterar o status da bicicleta
   */
  async alterarStatus(novoStatus){
    const acoes = ['DISPONIVEL','EM_USO', 'NOVA', 'APOSENTADA', 'REPARO_SOLICITADO', 'EM_REPARO']

    if (!acoes.includes(novoStatus))
      return false;

    this.status = novoStatus;
    await this.save();
    return true;
  }

  // Não retira o a bicicleta do banco de dados mas ela não deve mais aparecer caso seja pesquisada
  async softDelete(){
    this.status = "EXCLUIDA";
    await this.save();
  }

  // Verifica se a bicicleta foi excluida
  isReparoSolicitado(){
    return this.status === "REPARO_SOLICITADO";
  }

  // Verifica se a bicicleta está aposentada
  isAposentada(){
    return this.status === "APOSENTADA";
  }

  /**
   * Altera o status da bicicleta baseado na ação do reparador, Não salva a bicicleta
   * @param {string} statusAcaoReparador - Ação do reparador
   */
  acaoReparador(statusAcaoReparador){
    if(statusAcaoReparador === "REPARO")
      this.status = "EM_REPARO";

    if(statusAcaoReparador === "APOSENTADORIA")
      this.status = "APOSENTADA";
  }
};
