import { DateTime } from 'luxon';
import { Bicicleta } from '../models/Bicicleta.js';
import {Tranca} from '../models/Tranca.js';
import {InclusaoBicicleta} from '../models/InclusaoBicicleta.js'
import { Transaction } from 'sequelize';

export class InclusaoBicicletaRepo{
  /**
   * 
   * @param {Bicicleta} bicicleta 
   * @param {Tranca} tranca 
   * @param {Transaction|null} [transacao=null] 
   */
  static async criarInclusao(bicicleta, tranca, transacao=null){
    await InclusaoBicicleta.create({
        numeroBicicleta: bicicleta.numero,
        numeroTranca: tranca.numero,
        dataHora: DateTime.now().toSQL()
    }, {transaction: transacao});
  }
};
