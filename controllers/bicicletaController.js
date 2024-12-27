// Importações necessárias
import { Bicicleta } from '../models/Bicicleta.js';

export class BicicletaController {
  // Método para criar uma nova bicicleta
  static async criarBicicleta(req, res) {
    try {
      const { marca, modelo, ano, numero, status } = req.body;

      const novaBicicleta = await Bicicleta.create({ marca, modelo, ano, numero, status });

      return res.status(201).json(novaBicicleta);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Método para listar todas as bicicletas
  static async listarBicicletas(req, res) {
    try {
      const bicicletas = await Bicicleta.findAll();
      return res.status(200).json(bicicletas);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Método para obter uma bicicleta específica pelo ID
  static async obterBicicleta(req, res) {
    try {
      const { id } = req.params;

      const bicicleta = await Bicicleta.findByPk(id);
      if (!bicicleta) {
        return res.status(404).json({ error: 'Bicicleta não encontrada' });
      }

      return res.status(200).json(bicicleta);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Método para atualizar uma bicicleta pelo ID
  static async atualizarBicicleta(req, res) {
    try {
      const { id } = req.params;
      const { marca, modelo, ano, numero, status } = req.body;

      const bicicleta = await Bicicleta.findByPk(id);
      if (!bicicleta) {
        return res.status(404).json({ error: 'Bicicleta não encontrada' });
      }

      await bicicleta.update({ marca, modelo, ano, numero, status });
      return res.status(200).json(bicicleta);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Método para deletar uma bicicleta pelo ID
  static async deletarBicicleta(req, res) {
    try {
      const { id } = req.params;

      const bicicleta = await Bicicleta.findByPk(id);
      if (!bicicleta) {
        return res.status(404).json({ error: 'Bicicleta não encontrada' });
      }

      await bicicleta.destroy();
      return res.status(200).json({ message: 'Bicicleta deletada com sucesso' });

    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  static async integrarNaRede(req, res){

  }

  static async retirarDaRede(req, res){

  }

  static async alterarStatus(req, res){
    try{
        const {id, acao} = req.params;

        const bicicleta = await Bicicleta.findByPk(id);
        if (!bicicleta) 
            return res.status(404).json({ error: 'Bicicleta não encontrada' });

        bicicleta.status = acao;
        await bicicleta.save()
        return res.status(200).json(bicicleta);

    }catch (error){
        return res.status(500).json({ error: error.message });
    }
  }
}

export default BicicletaController;
