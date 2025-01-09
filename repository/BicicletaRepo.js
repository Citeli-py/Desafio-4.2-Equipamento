import { Op, Transaction, ValidationError } from 'sequelize';
import { Bicicleta } from '../models/Bicicleta.js';
import { DadoInvalido } from '../util/erros.js';

export class BicicletaRepo {
  static async getAllBicicletas() {
    return await Bicicleta.findAll({
      attributes: ["id", "marca", "modelo", "ano", "numero", "status"],
      where: { status: { [Op.ne]: 'EXCLUIDA' } },
    });
  }

  static async getBicicleta(id) {
    return await Bicicleta.findOne({
      where: {
        id,
        status: { [Op.ne]: 'EXCLUIDA' },
      },
    });
  }

  static async criarBicicleta(dados, transacao=null) {
    try {
      const bicicleta = await Bicicleta.create({
        ...dados,
        status: 'NOVA',
      }, {transaction: transacao});

      return { 
        sucesso: true, 
        bicicleta: {
          id: bicicleta.id,
          marca: bicicleta.marca,
          modelo: bicicleta.modelo,
          ano: bicicleta.ano,
          numero: bicicleta.numero,
          status: bicicleta.status
        } 
      };

    } catch (error) {
      if (error instanceof ValidationError) {
        return { sucesso: false, erro: DadoInvalido, mensagem: 'Dados inválidos' };
      }
      throw error;
    }
  }

  /**
   * 
   * @param {Bicicleta} bicicleta - Bicicleta a ser editada
   * @param {Object} dados - Dados para serem trocados
   * @param {Transaction} transacao - Transação externa para rollbacks
   * @returns {{sucesso: boolean, erro?: number, mensagem?: string, bicicleta?: Bicicleta}}
   */
  static async atualizarBicicleta(bicicleta, dados, transacao=null) {
    try {
      await bicicleta.update(dados, {transaction:transacao});
      return { 
        sucesso: true, 
        bicicleta: {
          id: bicicleta.id,
          marca: bicicleta.marca,
          modelo: bicicleta.modelo,
          ano: bicicleta.ano,
          numero: bicicleta.numero,
          status: bicicleta.status
        } 
      };
    } catch (error) {
      if (error instanceof ValidationError) {
        return { sucesso: false, erro: DadoInvalido, mensagem: 'Dados inválidos' };
      }
      throw error;
    }
  }

  /**
   * Deletar bicicleta
   * @param {Bicicleta} bicicleta 
   * @param {Transaction} transacao 
   * @returns {{sucesso: boolean, bicicleta: Bicicleta}}
   */
  static async deletarBicicleta(bicicleta, transacao=null) {
    try {
      await bicicleta.update({ status: 'EXCLUIDA' }, {transaction: transacao});
      return { 
        sucesso: true, 
        bicicleta: {
          id: bicicleta.id,
          marca: bicicleta.marca,
          modelo: bicicleta.modelo,
          ano: bicicleta.ano,
          numero: bicicleta.numero,
          status: bicicleta.status
        } 
      };
    } catch (error) {
      throw error;
    }
  }

  /**
  * Altera o status da bicicleta baseado na ação do reparador, Não salva a bicicleta
  * @param {Bicicleta} bicicleta 
  * @param {string} statusAcaoReparador - Ação do reparador
  */
  static async acaoReparador(bicicleta, statusAcaoReparador, transacao=null){
    if(statusAcaoReparador === "REPARO")
      bicicleta.status = "EM_REPARO";

    if(statusAcaoReparador === "APOSENTADORIA")
      bicicleta.status = "APOSENTADA";

    await bicicleta.save({transaction: transacao});
  }
}
