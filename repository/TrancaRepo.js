import { Op, Sequelize, Transaction, ValidationError } from 'sequelize';
import { Tranca } from "../models/Tranca.js"  
import { DadoInvalido } from '../util/erros.js';

import Database from '../db/Database.js';

export class TrancaRepo {

    static async getTranca(id){
        try{
            return await Tranca.findOne({
                where: {
                    id,
                    status: { [Op.ne]: 'EXCLUIDA' },
                },
            });
        } catch(error){
            throw error;
        }
    }

    static async getAllTrancas() {
        try {
            return await Tranca.findAll({
                attributes: ["id", "bicicleta", "numero", "localizacao", "anoDeFabricacao", "modelo", "status"],
                where: {
                    status: { [Op.ne]: 'EXCLUIDA' },
                },
            });
        } catch (error) {
            throw error;
        }
    }

    /**
     * Cria uma tranca no banco de dados seguindo as regras de negócio
     * 
     * @param {number} numero - Número da tranca
     * @param {string} localizacao - Localização da tranca
     * @param {string} anoDeFabricacao 
     * @param {string} modelo 
     * @param {string} status 
     * @param {null|Transaction} [transacao_externa=null] 
     * @returns {{sucesso: boolean, tranca?: Tranca, erro?: number, mensagem?: string}}
     * 
     * @throws {ValidationError}
     */
    static async criarTranca(numero, localizacao, anoDeFabricacao, modelo, status, transacao_externa=null){
        try {
            // O status inicial da tranca será “nova” (esta informação não pode ser editada).
            const tranca = await Tranca.create({numero, localizacao, anoDeFabricacao, modelo, status: "NOVO"}, {transaction: transacao_externa})
            return {sucesso: true, tranca }
        } catch(error) {
            
            if (error instanceof ValidationError) 
                return { sucesso: false, erro: DadoInvalido, mensagem: 'Dados inválidos' };

            throw error;
        }
    }

    /**
     * 
     * @param {Tranca} tranca 
     * @param {Object} dados 
     * @param {Transaction|null} [transacao_externa=null] 
     * @returns {{sucesso: boolean, erro?: number, mensagem?: string, tranca?: Tranca}}
     */
    static async editarTranca(tranca, dados, transacao_externa=null){
        try{
            const trancaEditada = await tranca.update(dados, {transaction: transacao_externa});
            return {sucesso: true, tranca: trancaEditada};

        } catch (error){
            if (error instanceof ValidationError) 
                return { sucesso: false, erro: DadoInvalido, mensagem: 'Dados inválidos' };

            throw error;
        }
    }

    /**
     * realiza um softdelete na tranca
     * @param {Tranca} tranca - Tranca
     * @param {null|Transaction} [transacao_externa=null] 
     */
    static async deletarTranca(tranca, transacao_externa=null){
        try{
            await tranca.update({ status: 'EXCLUIDA' }, {transaction: transacao_externa});
            return {sucesso: true, tranca: tranca};

        } catch(error){
            throw error;
        }
    }
    
    /**
     * Esse metodo tranca a Tranca, alterando seu status para OCUPADA e associando uma bicicleta a ela, 
     * essa bicicleta tem seu status trocado para disponível
     * 
     * @param {Tranca} tranca - Tranca que será trancada
     * @param {Bicicleta} bicicleta  - Bicicleta que sera presa na tranca
     * @param {Transaction|null} [transacao_externa=null] 
     */
    static async trancar(tranca, bicicleta=null, transacao_externa=null){
        let transaction = transacao_externa
        if(!transacao_externa)
            transaction = await Database.createTransaction();

        try{
            if (bicicleta){
                tranca.bicicleta = bicicleta.id;
                bicicleta.status = "DISPONIVEL";
                await bicicleta.save({transaction});
            }
            
            tranca.status = "OCUPADA";
            await tranca.save({transaction});

            // Caso não haja uma transação acima dessa
            if(!transacao_externa)
                transaction.commit();

        } catch(error){
            await transaction.rollback();
            throw error;
        }
    }

    /**
     * Metodo para destrancar a tranca, retirando a associação com uma bicicleta e alterando seu status para LIVRE
     * @param {Tranca} tranca 
     * @param {Transaction|null} [transacao_externa=null] - Transação a ser associada
     */
    static async destrancar(tranca, transacao_externa=null){
        try{
            tranca.bicicleta = null;
            tranca.status = "LIVRE";
            await tranca.save({transaction: transacao_externa});

        } catch(error){
            throw error;
        }
    }

    /**
     * Verifica se existe uma bicicleta na tranca, caso uma bicicleta for parametro verifica se aquela bicicleta está na tranca
     * 
     * @param {Tranca} tranca - Tranca
     * @param {Bicicleta} bicicleta - Bicicleta que pode estar na tranca
     * @returns {boolean} - Se existir uma bicicleta na tranca retorna true
     */
    static isBicicletaNaTranca(tranca, bicicleta=null){
        if(bicicleta)
            return tranca.bicicleta === bicicleta.id;

        return tranca.bicicleta !== null;
    }
}
