import { Sequelize, Transaction } from "sequelize";

import { Bicicleta } from "../models/Bicicleta.js";
import { InclusaoBicicleta } from "../models/InclusaoBicicleta.js";
import { RetiradaBicicleta } from "../models/RetiradaBicicleta.js";
import { Tranca } from "../models/Tranca.js";

import dotenv from 'dotenv';
dotenv.config();

/**
 * Classe Singleton para conexão com o banco de dados postgresql e tratamento de erros
 */
class Database {
    /**
     * @property {Sequelize} conexao
     */
    #conexao

    /**
     * Construtor da CLasse singleton database. Inicia os modelos e sincroniza com o banco de dados
     * @returns {Database} - Retorna a primeira instância de Database
     */
    constructor() {
        if (Database.instance) 
            return Database.instance; // Retorna a instância existente
        
        const env = process.env;
        this.#conexao = new Sequelize(env.DATABASE, env.DB_USER, env.DB_PASSWORD, {
            dialect: "postgres",
            host: process.env.DB_HOST,
            logging: true,
        });

        this.init();
        Database.instance = this; // Salva a instância
    }

    /**
     * Inicializa os modelos e relacionamentos
     */
    init(){
        Bicicleta.init(this.#conexao);
        Tranca.init(this.#conexao);

        InclusaoBicicleta.init(this.#conexao);
        RetiradaBicicleta.init(this.#conexao);
    }

    /**
     * Realiza a autenticação com o banco de dados, caso haja um erro retorna o erro apropriado
     * 
     * @returns {{sucess: boolean, error?: number}} - resposta da autenticação
     */
    async autenticacao(){
        // Realizar authenticação
        try {
            // Testando a conexão
            await this.#conexao.authenticate();
            return {sucess: true};
    
        } catch (error) {

            //console.log("Erro ao se conectar ao banco de dados: ");
            
            // Futuramente retornar o tipo de erro em um objeto
            switch (error.original.code) {
                case '28P01': // Login inválido
                    return {sucess: false, error: "Login inválido"};
            
                case 'EAI_AGAIN': // Host desconhecido
                    return {sucess: false, error: "Host inválido"};
            
                case '3D000': // Banco de dados não existe
                    return {sucess: false, error: "Banco de dados não existe"};
            
                default: // Outros erros
                    return {sucess: false, error: "Erro desconhecido"};
            }
        };
    }

    /**
     * Cria uma transação
     * @returns {Transaction}
     */
    async createTransaction(){
        return this.#conexao.transaction();
    }

    /**
     * Fecha a conexão com o banco
     */
    async close(){
        await this.#conexao.close();
    }

    /**
     * Retorna a conexão sequelize
     * @returns {Sequelize}
     */
    get conexao() {
        return this.#conexao;
    }

    
}

// Exporta uma única instância do Database
export default new Database();