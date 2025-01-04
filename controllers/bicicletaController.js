// Importações necessárias
import { Bicicleta } from '../models/Bicicleta.js';
import { AluguelApi } from '../api/aluguel.js';
import { InclusaoBicicleta } from '../models/InclusaoBicicleta.js';
import { DateTime } from 'luxon';
import { RetiradaBicicleta } from '../models/RetiradaBicicleta.js';
import { Tranca } from '../models/Tranca.js';

import { ErroDadoInvalido, ErroInterno, ErroNaoEncontrado, Sucesso } from '../util/responseHandler.js';

export class BicicletaController {

    static #verificarCamposObrigatorios(dados, camposObrigatorios) {
        const erros = [];
    
        camposObrigatorios.forEach(campo => {
            if (!dados[campo]) {
                erros.push({
                    codigo: "422",
                    mensagem: `Dado '${campo}' não foi inserido`,
                });
            }
        });
    
        return erros;
    }

    static #verificarCamposBicicleta(dados){
        return this.#verificarCamposObrigatorios(dados, ["marca", "modelo", "ano", "numero"]);
    }

    // Método para criar uma nova bicicleta
    static async criarBicicleta(req, res) {
        try {
            const { marca, modelo, ano, numero } = req.body;
            
            // Corrigir criação de bicicleta
            const novaBicicleta = await Bicicleta.criarBicicleta(marca, modelo, ano, numero)
            if (!novaBicicleta.sucesso)
                return ErroDadoInvalido.toResponse(res, "404", "Dados inválidos ao tentar criar bicicleta");

            return Sucesso.toResponse(res, novaBicicleta.bicicleta);
        } catch (error) {

            return ErroInterno.toResponse(res, "500", error, "Criar Bicicleta")
        }
    }

    // Método para listar todas as bicicletas
    static async listarBicicletas(req, res) {
        try {
            const bicicletas = await Bicicleta.getAllBicicletas();
            return Sucesso.toResponse(res, bicicletas);
        } catch (error) {

            return ErroInterno.toResponse(res, "500", error, "Listar Bicicleta");
        }
    }

    // Método para obter uma bicicleta específica pelo ID
    static async obterBicicleta(req, res) {
        try {
            const { id } = req.params;

            const bicicleta = await Bicicleta.getBicicleta(id);
            if (!bicicleta) 
                return ErroNaoEncontrado.toResponse(res, "404", 'Bicicleta não encontrada')

            return Sucesso.toResponse(res, bicicleta);
        } catch (error) {
            return ErroInterno.toResponse(res, "500", error, "Obter Bicicleta");
        }
    }

    // Método para atualizar uma bicicleta pelo ID
    static async atualizarBicicleta(req, res) {
        try {
            const { id } = req.params;
            const { marca, modelo, ano, numero } = req.body;

            const bicicleta = await Bicicleta.getBicicleta(id);
            if (!bicicleta) 
                return ErroNaoEncontrado.toResponse(res, "404", "Bicicleta não encontrada");

            const resultado = await bicicleta.atualizaBicicleta(marca, modelo, ano);
            if(!resultado.sucesso)
                return ErroDadoInvalido.toResponse(res, "404", "Dados inválidos ao tentar atualizar bicicleta");

            return Sucesso.toResponse(res, bicicleta);
        } catch (error) {

            return ErroInterno.toResponse(res, "500", error, "atualizar Bicicleta");
        }
    }

    // Apenas bicicletas com status “aposentada” e que não estiverem em nenhuma tranca podem ser excluídas. 
    // Método para deletar uma bicicleta pelo ID
    static async deletarBicicleta(req, res) {
        try {
            const { id } = req.params;

            const bicicleta = await Bicicleta.getBicicleta(id);
            if (!bicicleta) 
                return ErroNaoEncontrado.toResponse(res, "404", "Bicicleta não encontrada");

            if(!bicicleta.isAposentada())
                return ErroNaoEncontrado.toResponse(res, "404", 'Bicicleta não está aposentada');

            // Verifica se existe uma tranca com a bicicleta que será deletada
            const tranca = await Tranca.findOne({where:{bicicleta: bicicleta.id}});
            if(tranca)
                return ErroNaoEncontrado.toResponse(res, "404", 'Bicicleta está trancada');

            await bicicleta.softDelete();
            return Sucesso.toResponse(res,{});

        } catch (error) {
            return ErroInterno.toResponse(res, "500", error, "deletar Bicicleta");
        }
    }

    static async integrarNaRede(req, res){
        /*
        Regras:
        - O número da bicicleta deve ter sido cadastrado previamente no sistema.
        - A bicicleta deve estar com status de “NOVA” ou “EM_REPARO”.
        - A tranca deve estar com o status “LIVRE”.
        - Devem ser registrados: a data/hora da inserção na tranca, o número da bicicleta e o número da tranca.
        */

        try {
            const { idTranca, idBicicleta, idFuncionario } = req.body;

            //Verifica se esse funcionário existe
            const funcionario = await AluguelApi.getFuncionario(idFuncionario);
            if(!funcionario)
                return ErroDadoInvalido.toResponse(res, '422', "Funcionário não encontrado");

            // Verifica se existe a bicicleta
            const bicicleta = await Bicicleta.getBicicleta(idBicicleta);
            if (!bicicleta) 
                return ErroDadoInvalido.toResponse(res, '422', 'Bicicleta não encontrada' );

            // Se bicicleta não estiver nem NOVA nem EM_REPARO
            if (!['NOVA', 'EM_REPARO'].includes(bicicleta.status))
                return ErroDadoInvalido.toResponse(res, '422', 'Bicicleta com status inválido para a integração');

            const tranca = await Tranca.findByPk(idTranca);
            if (!tranca)
                return ErroDadoInvalido.toResponse(res, '422', "Tranca não encontrada");

            if(tranca.status !== 'LIVRE')
                return ErroDadoInvalido.toResponse(res, '422', "Tranca não está livre");

            await InclusaoBicicleta.criarInclusao(bicicleta, tranca);
            await tranca.trancar(bicicleta);
            return Sucesso.toResponse(res, {});

        } catch (error) {
            return ErroInterno.toResponse(res, "500", error, "integrar Bicicleta na rede");
        }
    }

    // Um funcionário retira uma bicicleta da rede pela sua tranca, anotando data e hora
    /*
    Esse metodo deve abrir a tranca da bicicleta, fazer as alterações necessárias baseadas no statusAcaoReparador e anotar os dados da retirada

    Regras:
    - O número da bicicleta deve ter sido cadastrado previamente no sistema
    - A bicicleta deve estar presa em uma tranca e com status 'REPARO_SOLICITADO'.
    - Devem ser registrados: a data/hora da retirada da tranca, a matrícula do reparador e o número da bicicleta.
    */
    static async retirarDaRede(req, res){
        try{
            const {idTranca, idBicicleta, idFuncionario, statusAcaoReparador} = req.body;

            //encapsular respostas
            const bicicleta = await Bicicleta.getBicicleta(idBicicleta);
            if (!bicicleta) 
                return ErroDadoInvalido.toResponse(res, '422', 'Bicicleta não encontrada' );

            if(bicicleta.isReparoSolicitado())
                return ErroDadoInvalido.toResponse(res, '422', 'Bicicleta não teve o reparo solicitado' );

            const tranca = await Tranca.findByPk(idTranca);
            if(!tranca)
                return ErroDadoInvalido.toResponse(res, '422', 'Tranca não encontrada');

            if(tranca.isBicicletaNaTranca(bicicleta))
                return ErroDadoInvalido.toResponse(res, '422', 'Bicicleta não está presa na tranca informada' );

            const funcionario = await AluguelApi.getFuncionario(idFuncionario);
            if(!funcionario)
                return ErroDadoInvalido.toResponse(res, '422', 'Funcionário não encontrado' );

            if(!["REPARO", "APOSENTADORIA"].includes(statusAcaoReparador))
                return ErroDadoInvalido.toResponse(res, '422', 'Ação do reparador inválida' );

            bicicleta.acaoReparador(statusAcaoReparador);
            
            await RetiradaBicicleta.criarRetirada(bicicleta, funcionario);
            await bicicleta.save();
            await tranca.destrancar();
            
            return Sucesso.toResponse(res, {})

        } catch (error){
            return ErroInterno.toResponse(res, "500", error, "Retirar bicicleta da Rede");
        }
    }

    static async alterarStatus(req, res){
        try{
            const {id, acao} = req.params;

            const bicicleta = await Bicicleta.getBicicleta(id)
            if (!bicicleta) 
                return ErroNaoEncontrado.toResponse(res, "404", "Bicicleta não encontrada");

            if ( !await bicicleta.alterarStatus(acao) )
                return ErroDadoInvalido.toResponse(res, "422", 'Status inválido');
           
            return Sucesso.toResponse(res, bicicleta);

        }catch (error){
            return ErroInterno.toResponse(res, "500", error, "alterar status da bicicleta");
        }
    }
}

export default BicicletaController;
