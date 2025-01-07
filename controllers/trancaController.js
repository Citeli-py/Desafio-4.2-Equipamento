import { Tranca } from '../models/Tranca.js';
import { Bicicleta } from '../models/Bicicleta.js'; 

const STATUS_ENUM = ['LIVRE', 'OCUPADA', 'NOVA', 'APOSENTADA', 'EM_REPARO'];

class TrancaFormatter {
  static format(tranca) {
    const { idTotem, ...formattedTranca } = tranca.toJSON(); // Remove o idTotem
    return formattedTranca;
  }

  static formatAll(trancas) {
    return trancas.map((tranca) => TrancaFormatter.format(tranca));
  }
}

export class TrancaController {
  // Recuperar todas as trancas
  static async listarTrancas(req, res) {
    try {
      const trancas = await Tranca.findAll();
      const formattedTrancas = TrancaFormatter.formatAll(trancas);
      return res.status(200).json(formattedTrancas);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Cadastrar uma nova tranca
  static async criarTranca(req, res) {
    try {
      const { numero, localizacao, anoDeFabricacao, modelo, status, idTotem } = req.body;

      if (status && !STATUS_ENUM.includes(status)) {
        return res.status(400).json({ error: `Dados Inválidos` });
      }

      const novaTranca = await Tranca.create({
        numero,
        localizacao,
        anoDeFabricacao,
        modelo,
        status: status || 'NOVA', // Valor padrão como "NOVA"
        idTotem, // Associando ao Totem
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

      const formattedTranca = TrancaFormatter.format(tranca);
      return res.status(200).json(formattedTranca);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Editar uma tranca
  static async atualizarTranca(req, res) {
    try {
      const { idTranca } = req.params;
      const { numero, localizacao, anoDeFabricacao, modelo, status } = req.body;

      if (status && !STATUS_ENUM.includes(status)) {
        return res.status(400).json({ error: `Status inválido. Os valores permitidos são: ${STATUS_ENUM.join(', ')}` });
      }

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

  // Remover uma tranca (Falta realizar a verificação de bicicletas associadas antes de deletar)
  static async deletarTranca(req, res) {
    try {
      const { idTranca } = req.params;
  
      const tranca = await Tranca.findByPk(idTranca);
      if (!tranca) {
        return res.status(404).json({ error: 'Tranca não encontrada' });
      }

      // Apenas trancas sem bicicletas associadas devem ser deletadas
      tranca.status = 'APOSENTADA';
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

      tranca.status = 'OCUPADA';
      if (bicicletaId) {
        const bicicleta = await Bicicleta.findByPk(bicicletaId);
        if (!bicicleta) {
          return res.status(404).json({ error: 'Bicicleta não encontrada' });
        }

        tranca.bicicletaId = bicicletaId; // Associação
        bicicleta.status = 'TRANCADA';
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

      tranca.status = 'LIVRE';
      if (bicicletaId) {
        const bicicleta = await Bicicleta.findByPk(bicicletaId);
        if (!bicicleta) {
          return res.status(404).json({ error: 'Bicicleta não encontrada' });
        }

        tranca.bicicletaId = null; // Removendo associação
        bicicleta.status = 'DISPONÍVEL';
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

      if (!STATUS_ENUM.includes(acao)) {
        return res.status(400).json({ error: `Ação inválida. Os valores permitidos são: ${STATUS_ENUM.join(', ')}` });
      }

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
