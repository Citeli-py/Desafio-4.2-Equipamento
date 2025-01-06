import { Op, ValidationError } from 'sequelize';
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

  static async criarBicicleta(dados) {
    try {
      const bicicleta = await Bicicleta.create({
        ...dados,
        status: 'NOVA',
      });

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

  static async atualizarBicicleta(bicicleta, dados) {
    try {
      await bicicleta.update(dados);
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

  static async deletarBicicleta(bicicleta) {
    try {
      await bicicleta.update({ status: 'EXCLUIDA' });
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
  static async acaoReparador(bicicleta, statusAcaoReparador){
    if(statusAcaoReparador === "REPARO")
      bicicleta.status = "EM_REPARO";

    if(statusAcaoReparador === "APOSENTADORIA")
      bicicleta.status = "APOSENTADA";

    await bicicleta.save();
  }
}
