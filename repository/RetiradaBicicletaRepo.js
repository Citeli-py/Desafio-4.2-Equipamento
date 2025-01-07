import { Bicicleta } from '../models/Bicicleta.js';
import { DateTime } from 'luxon';
import { RetiradaBicicleta } from '../models/RetiradaBicicleta.js';
import { Transaction } from 'sequelize';


export class RetiradaBicicletaRepo{
  /**
   * Cria uma retirada de bicicleta
   * 
   * @param {Bicicleta} bicicleta 
   * @param {Object} funcionario 
   * @param {Transaction|null} [transacao=null] 
   */
  static async criarRetirada(bicicleta, funcionario, transacao=null){
    await RetiradaBicicleta.create({
        numeroBicicleta: bicicleta.numero,
        matriculaFuncionario: funcionario.matricula,
        dataHora: DateTime.now().toSQL()
    }, {transaction: transacao});
  } 
};
