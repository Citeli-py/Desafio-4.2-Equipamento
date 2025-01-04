import { Tranca } from '../models/Tranca.js';
import { Bicicleta } from '../models/Bicicleta.js'; 

export class TrancaController {
  // Recuperar todas as trancas
  static async listarTrancas(req, res) {
    try {
      const trancas = await Tranca.findAll();
      return res.status(200).json(trancas);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Cadastrar uma nova tranca
  static async criarTranca(req, res) {
    try {
      const { numero, localizacao, anoDeFabricacao, modelo, status } = req.body;

      const novaTranca = await Tranca.create({ 
        numero, 
        localizacao, 
        anoDeFabricacao, 
        modelo, 
        status 
      });

      return res.status(201).json(novaTranca);
    } catch (error) {
      return res.status(422).json({ error: 'Dados inválidos' });
    }
  }

  // Obter uma tranca específica
  static async obterTranca(req, res) {
    try {
      const { idTranca } = req.params;

      const tranca = await Tranca.findByPk(idTranca);
      if (!tranca) {
        return res.status(404).json({ error: 'Tranca não encontrada' });
      }

      return res.status(200).json(tranca);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Editar uma tranca
  static async atualizarTranca(req, res) {
    try {
      const { idTranca } = req.params;
      const { numero, localizacao, anoDeFabricacao, modelo, status } = req.body;

      const tranca = await Tranca.findByPk(idTranca);
      if (!tranca) {
        return res.status(404).json({ error: 'Tranca não encontrada' });
      }

      await tranca.update({ numero, localizacao, anoDeFabricacao, modelo, status });
      return res.status(200).json({ message: 'Dados atualizados com sucesso', tranca });
    } catch (error) {
      return res.status(422).json({ error: 'Dados inválidos' });
    }
  }

  // Remover uma tranca
  static async deletarTranca(req, res) {
    try {
      const { idTranca } = req.params;
  
      const tranca = await Tranca.findByPk(idTranca);
      if (!tranca) {
        return res.status(404).json({ error: 'Tranca não encontrada' });
      }
      tranca.status = 'excluída';
      await tranca.save();
  
      return res.status(200).json({ message: 'Tranca removida com sucesso', tranca });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Obter bicicleta na tranca
  static async obterBicicletaNaTranca(req, res) {
    try {
      const { idTranca } = req.params;

      const tranca = await Tranca.findByPk(idTranca, { include: Bicicleta });
      if (!tranca) {
        return res.status(404).json({ error: 'Tranca não encontrada' });
      }

      return res.status(200).json(tranca.Bicicleta || { message: 'Nenhuma bicicleta associada' });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Trancar a tranca
  static async trancarTranca(req, res) {
    try {
      const { idTranca } = req.params;
      const { bicicletaId } = req.body;

      const tranca = await Tranca.findByPk(idTranca);
      if (!tranca) {
        return res.status(404).json({ error: 'Tranca não encontrada' });
      }

      tranca.status = 'trancada';
      if (bicicletaId) {
        const bicicleta = await Bicicleta.findByPk(bicicletaId);
        if (!bicicleta) {
          return res.status(404).json({ error: 'Bicicleta não encontrada' });
        }

        tranca.bicicletaId = bicicletaId; // Associação
        bicicleta.status = 'trancada';
        await bicicleta.save();
      }

      await tranca.save();
      return res.status(200).json(tranca);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Destrancar a tranca
  static async destrancarTranca(req, res) {
    try {
      const { idTranca } = req.params;
      const { bicicletaId } = req.body;

      const tranca = await Tranca.findByPk(idTranca);
      if (!tranca) {
        return res.status(404).json({ error: 'Tranca não encontrada' });
      }

      tranca.status = 'destrancada';
      if (bicicletaId) {
        const bicicleta = await Bicicleta.findByPk(bicicletaId);
        if (!bicicleta) {
          return res.status(404).json({ error: 'Bicicleta não encontrada' });
        }

        tranca.bicicletaId = null; // Removendo associação
        bicicleta.status = 'disponível';
        await bicicleta.save();
      }

      await tranca.save();
      return res.status(200).json(tranca);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Alterar status da tranca
  static async alterarStatusTranca(req, res) {
    try {
      const { idTranca, acao } = req.params;

      const tranca = await Tranca.findByPk(idTranca);
      if (!tranca) {
        return res.status(404).json({ error: 'Tranca não encontrada' });
      }

      tranca.status = acao;
      await tranca.save();
      return res.status(200).json(tranca);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}

export default TrancaController;


