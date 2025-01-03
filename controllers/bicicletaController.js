// Importações necessárias
import { Bicicleta } from '../models/Bicicleta.js';
import { AluguelApi } from '../api/aluguel.js';
import { Inclusao } from '../models/Inclusao.js';
import { DateTime } from 'luxon';
import { Retirada } from '../models/Retirada.js';
import { Tranca } from '../models/Tranca.js';

export class BicicletaController {

    static #acoes = ['DISPONIVEL','EM_USO', 'NOVA', 'APOSENTADA', 'REPARO_SOLICITADO', 'EM_REPARO']

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
            
            // Verificar campos obrigatórios
            const erros = this.#verificarCamposBicicleta(req.body);
            if (erros.length > 0) 
                return res.status(422).json(erros);
            
            // Corrigir criação de bicicleta
            const novaBicicleta = await Bicicleta.create({ marca, modelo, ano, numero, status: "NOVA" });

            return res.status(200).json(novaBicicleta);
        } catch (error) {
            // Falha no sistema, gerar log
            console.log(error)
            return res.status(500).json({ codigo: '500', mensagem: error.message });
        }
    }

    // Método para listar todas as bicicletas
    static async listarBicicletas(req, res) {
        try {
            const bicicletas = await Bicicleta.getAllBicicletas();
            return res.status(200).json(bicicletas);
        } catch (error) {
            return res.status(500).json({ codigo: '500', mensagem: error.message });
        }
    }

    // Método para obter uma bicicleta específica pelo ID
    static async obterBicicleta(req, res) {
        try {
            const { id } = req.params;

            const bicicleta = await Bicicleta.getBicicleta(id);
            if (!bicicleta) 
                return res.status(404).json({codigo: '404', mensagem: 'Bicicleta não encontrada' });

            return res.status(200).json(bicicleta);
        } catch (error) {
            return res.status(500).json({ codigo: '500', mensagem: error.message });
        }
    }

    // Método para atualizar uma bicicleta pelo ID
    static async atualizarBicicleta(req, res) {
        try {
            const { id } = req.params;
            const { marca, modelo, ano, numero } = req.body;

            // Verificar campos obrigatórios
            const erros = this.#verificarCamposBicicleta(req.body);
            if (erros.length > 0) 
                return res.status(422).json(erros);

            const bicicleta = await Bicicleta.getBicicleta(id);
            if (!bicicleta) {
                return res.status(404).json({codigo: '404', mensagem: 'Bicicleta não encontrada' });
            }

            await bicicleta.update({ marca, modelo, ano });
            return res.status(200).json(bicicleta);
        } catch (error) {
            return res.status(500).json({ codigo: '500', mensagem: error.message });
        }
    }

    // Apenas bicicletas com status “aposentada” e que não estiverem em nenhuma tranca podem ser excluídas. 
    // Método para deletar uma bicicleta pelo ID
    static async deletarBicicleta(req, res) {
        try {
            const { id } = req.params;

            const bicicleta = await Bicicleta.getBicicleta(id);
            if (!bicicleta) 
                return res.status(404).json({codigo: '404', mensagem: 'Bicicleta não encontrada' });

            if(!bicicleta.isAposentada())
                return res.status(404).json({codigo: '404', mensagem: 'Bicicleta não está aposentada' });

            // Verifica se existe uma tranca com a bicicleta que será deletada
            const tranca = await Tranca.findOne({where:{bicicleta: bicicleta.id}});
            if(tranca)
                return res.status(404).json({codigo: '404', mensagem: 'Bicicleta está trancada' });

            bicicleta.softDelete();
            await bicicleta.save()
            return res.status(200).json();

        } catch (error) {
            return res.status(500).json({ codigo: '500', mensagem: error.message });
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
                return res.status(422).json({codigo: '422', mensagem: "Funcionário não encontrado"})

            // Verifica se existe a bicicleta
            const bicicleta = await Bicicleta.getBicicleta(idBicicleta);
            if (!bicicleta) 
                return res.status(422).json({codigo: '422', mensagem: 'Bicicleta não encontrada' });

            // Se bicicleta não estiver nem NOVA nem EM_REPARO
            if (!['NOVA', 'EM_REPARO'].includes(bicicleta.status))
                return res.status(422).json({codigo: "422", mensagem: 'Bicicleta com status inválido para a integração'})

            const tranca = await Tranca.findByPk(idTranca);
            if (!tranca)
                return res.status(422).json({codigo: '422', mensagem: "Tranca não encontrada"});

            if(tranca.status !== 'LIVRE')
                return res.status(422).json({codigo: '422', mensagem: "Tranca não está livre"});

            await Inclusao.create({
                numeroBicicleta: bicicleta.numero,
                numeroTranca: tranca.numero,
                dataHora: DateTime.now().toSQL()
            });

            await tranca.trancar(bicicleta);
            return res.status(200).json({});

        } catch (error) {
            return res.status(500).json({ codigo: '500', mensagem: error.message });
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
                return res.status(422).json({codigo: '422', mensagem: 'Bicicleta não encontrada' });

            if(bicicleta.status !== "REPARO_SOLICITADO")
                return res.status(422).json({codigo: '422', mensagem: 'Bicicleta não teve o reparo solicitado' });

            const tranca = await Tranca.findByPk(idTranca);
            if(!tranca)
                return res.status(422).json({codigo: '422', mensagem: 'Tranca não encontrada' });

            if(tranca.bicicleta !== bicicleta.id)
                return res.status(422).json({codigo: '422', mensagem: 'Bicicleta não está presa na tranca informada' });

            const funcionario = await AluguelApi.getFuncionario(idFuncionario);
            if(!funcionario)
                return res.status(422).json({codigo: '422', mensagem: 'Funcionário não encontrado' });

            if(statusAcaoReparador === "REPARO")
                bicicleta.status = "EM_REPARO";

            if(statusAcaoReparador === "APOSENTADORIA")
                bicicleta.status = "APOSENTADA";

            if(!["REPARO", "APOSENTADORIA"].includes(statusAcaoReparador))
                return res.status(422).json({codigo: '422', mensagem: 'Ação do reparador inválida' });

            
            await Retirada.create({
                numeroBicicleta: bicicleta.numero,
                matriculaFuncionario: funcionario.matricula,
                dataHora: DateTime.now().toSQL()
            });

            await bicicleta.save();
            await tranca.destrancar();
            
            return res.status(200).json({});

        } catch (error){
            return res.status(500).json({ codigo: '500', mensagem: error.message });
        }
    }

    static async alterarStatus(req, res){
        try{
            const {id, acao} = req.params;

            if (!this.#acoes.includes(acao))
                return res.status(422).json({codigo: "422", mensagem: 'Ação inválida' })

            const bicicleta = await Bicicleta.getBicicleta(id)
            if (!bicicleta) 
                return res.status(404).json({codigo: "404", mensagem: 'Bicicleta não encontrada' });

            bicicleta.status = acao;
            await bicicleta.save();
            return res.status(200).json(bicicleta);

        }catch (error){
            // Aqui é uma falha no sistema, deve ser anotado no arquivo de log
            return res.status(500).json({ codigo: '500', mensagem: error.message });
        }
    }
}

export default BicicletaController;
