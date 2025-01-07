import { Bicicleta } from '../models/Bicicleta.js';
import { DadoFaltante, DadoInvalido, DadoNaoEncontrado } from '../util/erros.js'; 
import { TrancaRepo } from '../repository/TrancaRepo.js';

export class TrancaService {

    static async listarTrancas(){
        return await TrancaRepo.getAllTrancas();
    }

    static async obterTranca(id){
        const tranca = await TrancaRepo.getTranca(id);
        if (!tranca)
            return {sucesso: false, erro: DadoNaoEncontrado, mensagem: "Tranca não encontrada"};

        return {
            sucesso: true, 
            tranca: {
                id:tranca.id,
                bicicleta:tranca.bicicleta,
                numero:tranca.numero,
                localizacao:tranca.localizacao,
                anoDeFabricacao:tranca.anoDeFabricacao,
                modelo:tranca.modelo,
                status:tranca.status
            }
        };
    }

}
