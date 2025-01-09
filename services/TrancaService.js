import { DadoFaltante, DadoInvalido, DadoNaoEncontrado } from '../util/erros.js'; 
import { TrancaRepo } from '../repository/TrancaRepo.js';
import { BicicletaRepo } from '../repository/BicicletaRepo.js';
import {Tranca} from '../models/Tranca.js';
import { TotemRepo } from '../repository/TotemRepo.js';
import { AluguelApi } from "../api/aluguel.js"
import { InclusaoTrancaRepo } from '../repository/InclusaoTrancaRepo.js';
import { Totem } from '../models/Totem.js';
import Database from '../db/Database.js';
import { RetiradaTrancaRepo } from '../repository/RetiradaTrancaRepo.js';

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

        let bicicleta = null;
        if(idBicicleta) {
            bicicleta = await BicicletaRepo.getBicicleta(idBicicleta);
            if(!bicicleta)
                return {sucesso: false, erro: DadoNaoEncontrado, mensagem: "Bicicleta não encontrada"};
        }

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

    static async destrancarTranca(idTranca, idBicicleta){
        // Realiza o destrancamento da tranca alterando o status da mesma de acordo. 
        // Caso receba o id da bicleta no corpo do post também altera o status da mesma e desassocia a tranca à bicicleta.

        const tranca = await TrancaRepo.getTranca(idTranca);
        if(!tranca)
            return {sucesso: false, erro: DadoNaoEncontrado, mensagem: "Tranca não encontrada"};

        if(tranca.status !== "OCUPADA")
            return {sucesso: false, erro: DadoInvalido, mensagem: "Tranca já está destrancada"};

        // Se existir uma bicicleta presa na tranca o status dela tem que ser alterado, logo não é possivel fazer a operação assim
        if(!idBicicleta && tranca.bicicleta)
            return {sucesso: false, erro: DadoInvalido, mensagem: "Deve ser informada a bicicleta presa na tranca"};

        let bicicleta = null;
        if(idBicicleta) {
            bicicleta = await BicicletaRepo.getBicicleta(idBicicleta);
            if(!bicicleta)
                return {sucesso: false, erro: DadoNaoEncontrado, mensagem: "Bicicleta não encontrada"};

            if(bicicleta.id !== tranca.bicicleta)
                return {sucesso: false, erro: DadoInvalido, mensagem: "Tranca não possui a bicicleta informada"};
        }

        await TrancaRepo.destrancar(tranca, bicicleta);

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

    static async obterBicicleta(idTranca){
        const tranca = await TrancaRepo.getTranca(idTranca);
        if(!tranca)
            return {sucesso: false, erro: DadoInvalido, mensagem: "Id da tranca inválido"};

        if(!tranca.bicicleta)
            return {sucesso: false, erro: DadoNaoEncontrado, mensagem: "Não há bicicleta na tranca"};

        const bicicleta = await BicicletaRepo.getBicicleta(tranca.bicicleta);
        if(!bicicleta)
            return {sucesso: false, erro: DadoNaoEncontrado, mensagem: "Bicicleta não encontrada"};

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
    }

    /**
     * Altera o status de uma tranca
     * @param {number} idTranca - ID da tranca
     * @param {string} status - novo status da tranca
     * @returns {{sucesso: boolean, erro?: number, mensagem?: string, tranca?: Tranca}}
     */
    static async alterarStatus(idTranca, status){
        const status_possiveis = ['LIVRE', 'OCUPADA', 'NOVA', 'APOSENTADA', 'EM_REPARO'];

        if(!status_possiveis.includes(status))
            return {sucesso: false, erro: DadoInvalido, mensagem: "Status inválido"};

        const tranca = await TrancaRepo.getTranca(idTranca);
        if(!tranca)
            return {sucesso: false, erro: DadoNaoEncontrado, mensagem: "Tranca não encontrada"};

        const resposta = await TrancaRepo.editarTranca(tranca, {status});
        if(!resposta.sucesso)
            return resposta;

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

    /**
     * Integra uma tranca em um totem
     * @param {number} idTotem - Id totem
     * @param {number} idTranca - id tranca
     * @param {number} idFuncionario - id Funcionario
     * @returns {{sucesso: boolean, erro?: number, mensagem?: string}}
     */
    static async integrarNaRede(idTotem, idTranca, idFuncionario){

        const tranca = await TrancaRepo.getTranca(idTranca);
        if(!tranca)
            return {sucesso: false, erro: DadoNaoEncontrado, mensagem: "Tranca não encontrada"};

        if(!["NOVA", "EM_REPARO"].includes(tranca.status))
            return {sucesso: false, erro: DadoInvalido, mensagem: "Tranca não está apta a ser integrada"};

        const totem = await TotemRepo.getTotem(idTotem);
        if(!totem)
            return {sucesso: false, erro: DadoNaoEncontrado, mensagem: "Totem não encontrado"};

        const funcionario = await AluguelApi.getFuncionario(idFuncionario);
        if(!funcionario)
            return {sucesso: false, erro: DadoNaoEncontrado, mensagem: "Funcionário não encontrada"};

        const transacao = await Database.createTransaction();
        
        try{
            await InclusaoTrancaRepo.criarInclusao(funcionario, tranca, transacao);
            const resposta = await TrancaRepo.editarTranca(tranca, {status: "LIVRE", idTotem: idTotem}, transacao);

            if(resposta.sucesso)
                await transacao.commit();
            else
                await transacao.rollback();
    
        } catch(error){
    
            await transacao.rollback();
            throw error;
        }

        return {sucesso: true}
    }


    /**
     * Retira uma tranca da rede
     * @param {number} idTotem - ID do totem
     * @param {number} idTranca - Id da tranca
     * @param {number} idFuncionario - id do funcionario
     * @param {string} statusAcaoReparador - Ação do reparador
     * @returns {{sucesso: boolean, erro?: number, mensagem?: string}}
     */
    static async retirarDaRede(idTotem, idTranca, idFuncionario, statusAcaoReparador){
        // tranca deve estar sem nenhuma bicicleta presa nela.
        // Devem ser registrados: a data/hora da retirada da tranca, o número da tranca e a matrícula do reparador.

        if(!["REPARO", "APOSENTADORIA"].includes(statusAcaoReparador))
            return { sucesso: false, erro: DadoInvalido, mensagem: 'Ação do reparador inválida' };

        const tranca = await TrancaRepo.getTranca(idTranca);
        if(!tranca)
            return {sucesso: false, erro: DadoNaoEncontrado, mensagem: "Tranca não encontrada"};

        if(tranca.bicicleta)
            return {sucesso: false, erro: DadoInvalido, mensagem: "Existe uma bicicleta presa na tranca"};

        const totem = await TotemRepo.getTotem(idTotem);
        if(!totem)
            return {sucesso: false, erro: DadoNaoEncontrado, mensagem: "Totem não encontrado"};

        if(totem.id !== tranca.idTotem)
            return {sucesso: false, erro: DadoNaoEncontrado, mensagem: "Tranca não está presa ao Totem informado"};

        const funcionario = await AluguelApi.getFuncionario(idFuncionario);
        if(!funcionario)
            return {sucesso: false, erro: DadoNaoEncontrado, mensagem: "Funcionário não encontrada"};

        const transacao = await Database.createTransaction();
        
        try{
            await RetiradaTrancaRepo.criarRetirada(funcionario, tranca, transacao);
            await TrancaRepo.destrancar(tranca, null, transacao);

            let resposta = null
            if(statusAcaoReparador === "REPARO")
                resposta = await TrancaRepo.editarTranca(tranca, {status: "EM_REPARO", idTotem: null}, transacao);

            if(statusAcaoReparador === "APOSENTADORIA")
                resposta = await TrancaRepo.editarTranca(tranca, {status: "APOSENTADA", idTotem: null}, transacao);

            if(resposta && resposta.sucesso)
                await transacao.commit();
            else
                await transacao.rollback();
    
        } catch(error){
    
            await transacao.rollback();
            throw error;
        }

        return {sucesso: true}
    }

}
