// Importações necessárias
import { Op } from 'sequelize';
import { Bicicleta } from '../models/Bicicleta.js';

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
        return this.#verificarCamposObrigatorios(dados, ["marca", "modelo", "ano"]);
    }

    // Método para criar uma nova bicicleta
    static async criarBicicleta(req, res) {
        try {
            const { marca, modelo, ano } = req.body;
            
            // Verificar campos obrigatórios
            const erros = this.#verificarCamposBicicleta(req.body);
            if (erros.length > 0) 
                return res.status(422).json(erros);

            // Número deve ser gerado pelo sistema
            const numero = parseInt(Math.random()*100); // Será substituido pela regra de negócio
            const novaBicicleta = await Bicicleta.create({ marca, modelo, ano, numero, status: "NOVA" });

            return res.status(200).json(novaBicicleta);
        } catch (error) {
            // Falha no sistema, gerar log
            console.log(error)
            return res.status(500).json({ codigo: '500', mensagem: error.message });
        }
    }

    static async #getAllBicicletas(){
        return await Bicicleta.findAll({
            where: {
                status: {
                    [Op.ne]: "EXCLUIDA"
                }
            }
        });
    }

    // Método para listar todas as bicicletas
    static async listarBicicletas(req, res) {
        try {
            const bicicletas = await this.#getAllBicicletas();
            return res.status(200).json(bicicletas);
        } catch (error) {
            return res.status(500).json({ codigo: '500', mensagem: error.message });
        }
    }

    // Método para obter uma bicicleta específica pelo ID
    static async obterBicicleta(req, res) {
        try {
            const { id } = req.params;

            const bicicleta = await Bicicleta.findByPk(id);
            if (!bicicleta || bicicleta.isExcluida()) 
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
            const { marca, modelo, ano } = req.body;

            // Verificar campos obrigatórios
            const erros = this.#verificarCamposBicicleta(req.body);
            if (erros.length > 0) 
                return res.status(422).json(erros);

            const bicicleta = await Bicicleta.findByPk(id);
            if (!bicicleta || bicicleta.isExcluida()) {
                return res.status(404).json({codigo: '404', mensagem: 'Bicicleta não encontrada' });
            }

            await bicicleta.update({ marca, modelo, ano });
            return res.status(200).json(bicicleta);
        } catch (error) {
            return res.status(500).json({ codigo: '500', mensagem: error.message });
        }
    }

    // Método para deletar uma bicicleta pelo ID
    static async deletarBicicleta(req, res) {
        try {
            const { id } = req.params;

            const bicicleta = await Bicicleta.findByPk(id);
            if (!bicicleta) 
                return res.status(404).json({codigo: '404', mensagem: 'Bicicleta não encontrada' });

            bicicleta.softDelete();
            await bicicleta.save()
            return res.status(200).json();

        } catch (error) {
            return res.status(500).json({ codigo: '500', mensagem: error.message });
        }
    }

    static async integrarNaRede(req, res){

    }

    static async retirarDaRede(req, res){

    }

    static async alterarStatus(req, res){
        try{
            const {id, acao} = req.params;

            if (!this.#acoes.includes(acao))
                return res.status(422).json({codigo: "422", mensagem: 'Ação inválida' })

            const bicicleta = await Bicicleta.findByPk(id);
            if (!bicicleta || bicicleta.isExcluida()) 
                return res.status(404).json({codigo: "404", mensagem: 'Bicicleta não encontrada' });

            bicicleta.status = acao;
            await bicicleta.save()
            return res.status(200).json(bicicleta);

        }catch (error){
            // Aqui é uma falha no sistema, deve ser anotado no arquivo de log
            return res.status(500).json({ codigo: '500', mensagem: error.message });
        }
    }
}

export default BicicletaController;
