import { DateTime } from 'luxon';
import { Bicicleta } from '../models/Bicicleta.js';
import {Tranca} from '../models/Tranca.js';
import {InclusaoBicicleta} from '../models/InclusaoBicicleta.js'

export class InclusaoBicicletaRepo{
  /**
   * 
   * @param {Bicicleta} bicicleta 
   * @param {Tranca} tranca 
   */
  static async criarInclusao(bicicleta, tranca){
    await InclusaoBicicleta.create({
        numeroBicicleta: bicicleta.numero,
        numeroTranca: tranca.numero,
        dataHora: DateTime.now().toSQL()
    });
  }
};
