import { DateTime } from 'luxon';
import {Tranca} from '../models/Tranca.js';
import { Transaction } from 'sequelize';
import { RetiradaTranca } from '../models/RetiradaTranca.js';

export class RetiradaTrancaRepo{
  /**
   * 
   * @param {Object} funcionario 
   * @param {Tranca} tranca 
   * @param {Transaction|null} [transacao=null] 
   */
  static async criarRetirada(funcionario, tranca, transacao=null){
    await RetiradaTranca.create({
        matriculaReparador: funcionario.matricula,
        numeroTranca: tranca.numero,
        dataHora: DateTime.now().toSQL()
    }, {transaction: transacao});
  }
};
