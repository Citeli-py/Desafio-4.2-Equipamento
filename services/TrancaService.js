import { Bicicleta } from '../models/Bicicleta.js';
import { DadoFaltante, DadoInvalido, DadoNaoEncontrado } from '../util/erros.js'; 
import { TrancaRepo } from '../repository/TrancaRepo.js';

export class TrancaService {

    static async listarTrancas(){
        return await TrancaRepo.getAllTrancas();
    }

}
