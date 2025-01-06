import { Bicicleta } from '../models/Bicicleta.js';
import { DateTime } from 'luxon';
import { RetiradaBicicleta } from '../models/RetiradaBicicleta.js';


export class RetiradaBicicletaRepo{
  /**
   * Cria uma retirada de bicicleta
   * 
   * @param {Bicicleta} bicicleta 
   * @param {Object} funcionario 
   */
  static async criarRetirada(bicicleta, funcionario){
    await RetiradaBicicleta.create({
        numeroBicicleta: bicicleta.numero,
        matriculaFuncionario: funcionario.matricula,
        dataHora: DateTime.now().toSQL()
    });
  } 
};
