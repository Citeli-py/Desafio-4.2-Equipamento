import { Bicicleta } from '../models/Bicicleta.js';
import { DadoFaltante, DadoInvalido, DadoNaoEncontrado } from '../util/erros.js'; 
import { TrancaRepo } from '../repository/TrancaRepo.js';
import { BicicletaRepo } from '../repository/BicicletaRepo.js';

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

    static async criarTranca(numero, localizacao, anoDeFabricacao, modelo, status){

        const respostaRepo = await TrancaRepo.criarTranca(numero, localizacao, anoDeFabricacao, modelo, status);

        if (!respostaRepo.sucesso)
            return respostaRepo;

        const tranca = respostaRepo.tranca;
        return {
            sucesso: true, 
            tranca: {
                id: tranca.id,
                bicicleta: tranca.bicicleta,
                numero: tranca.numero,
                localizacao: tranca.localizacao,
                anoDeFabricacao: tranca.anoDeFabricacao,
                modelo: tranca.modelo,
                status: tranca.status
            }
        };

    }

    static async editarTranca(id, numero, localizacao, anoDeFabricacao, modelo, status){
        // localizacao, status e numero não podem ser editados

        const tranca = await TrancaRepo.getTranca(id);
        if(!tranca)
            return {sucesso: false, erro: DadoNaoEncontrado, mensagem: "Tranca não encontrada"};

        if(parseInt(anoDeFabricacao).toString() !== anoDeFabricacao)
            return {sucesso: false, erro: DadoInvalido, mensagem: "Ano de fabricação inválido"}
        
        const dados = {};
        if (anoDeFabricacao !== null && anoDeFabricacao !== "") 
            dados.anoDeFabricacao = anoDeFabricacao;

        if (modelo !== null && modelo !== "") 
            dados.modelo = modelo;
    
        const resposta = await TrancaRepo.editarTranca(tranca, dados);
        if(!resposta.sucesso)
            return resposta;

        const trancaEditada = resposta.tranca;
        return {
            sucesso: true, 
            tranca: {
                id: trancaEditada.id,
                bicicleta: trancaEditada.bicicleta,
                numero: trancaEditada.numero,
                localizacao: trancaEditada.localizacao,
                anoDeFabricacao: trancaEditada.anoDeFabricacao,
                modelo: trancaEditada.modelo,
                status: trancaEditada.status
            }
        };
    }


    static async deletarTranca(id){
        // Apenas trancas que não estiverem com nenhuma bicicleta podem ser excluídas.
        const tranca = await TrancaRepo.getTranca(id);
        if(!tranca)
            return {sucesso: false, erro: DadoNaoEncontrado, mensagem: "Tranca não encontrada"};

        if(tranca.bicicleta !== null)
            return {sucesso: false, erro: DadoInvalido, mensagem: "A tranca não pode ser removida por estar com uma bicicleta"};

        await TrancaRepo.deletarTranca(tranca);

        return {sucesso: true};
    }

    static async trancarTranca(idTranca, idBicicleta){
        // Realiza o trancamento da tranca alterando o status da mesma de acordo. 
        // Caso receba o id da bicleta no corpo do post também altera o status da mesma e associa a tranca à bicicleta.

        const tranca = await TrancaRepo.getTranca(idTranca);
        if(!tranca)
            return {sucesso: false, erro: DadoNaoEncontrado, mensagem: "Tranca não encontrada"};

        if(tranca.status === "OCUPADA")
            return {sucesso: false, erro: DadoInvalido, mensagem: "Tranca já está trancada"};

        const bicicleta = await BicicletaRepo.getBicicleta(idBicicleta);
        if(!bicicleta)
            return {sucesso: false, erro: DadoNaoEncontrado, mensagem: "Bicicleta não encontrada"};

        await TrancaRepo.trancar(tranca, bicicleta);
        return {
            sucesso: true, 
            tranca: {
                id: tranca.id,
                bicicleta: tranca.bicicleta,
                numero: tranca.numero,
                localizacao: tranca.localizacao,
                anoDeFabricacao: tranca.anoDeFabricacao,
                modelo: tranca.modelo,
                status: tranca.status
            }
        };

    }

}
