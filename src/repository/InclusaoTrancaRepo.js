import { DateTime } from 'luxon';
import {Tranca} from '../models/Tranca.js';
import { InclusaoTranca } from '../models/InclusaoTranca.js';
import { Transaction } from 'sequelize';

export class InclusaoTrancaRepo{
  /**
   * 
   * @param {Object} funcionario 
   * @param {Tranca} tranca 
   * @param {Transaction|null} [transacao=null] 
   */
  static async criarInclusao(funcionario, tranca, transacao=null){
    await InclusaoTranca.create({
        matriculaReparador: funcionario.matricula,
        numeroTranca: tranca.numero,
        dataHora: DateTime.now().toSQL()
    }, {transaction: transacao});
  }
};
