import { Tranca } from '../models/Tranca.js';
import { Bicicleta } from '../models/Bicicleta.js';

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
      const { numero, localizacao, anoDeFabricacao, modelo, idTotem } = req.body;

      const novaTranca = await Tranca.create({
        numero,
        localizacao,
        anoDeFabricacao,
        modelo,
        idTotem,
      });

      novaTranca.status = 'NOVA';
      await novaTranca.save();

      const formattedTranca = TrancaFormatter.format(novaTranca);
      return res.status(201).json(formattedTranca);
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
      const { numero, localizacao, anoDeFabricacao, modelo, status, idTotem } = req.body;

      const tranca = await Tranca.findByPk(idTranca);
      if (!tranca) {
        return res.status(404).json({ error: 'Tranca não encontrada' });
      }

      await tranca.update({ numero, localizacao, anoDeFabricacao, modelo, status, idTotem });
      const formattedTranca = TrancaFormatter.format(tranca);

      return res.status(200).json({ message: 'Dados atualizados com sucesso', tranca: formattedTranca });
    } catch (error) {
      return res.status(422).json({ error: 'Dados inválidos' });
    }
  }

  // Remover uma tranca (apenas sem bicicletas associadas)
  static async deletarTranca(req, res) {
    try {
      const { idTranca } = req.params;

      const tranca = await Tranca.findByPk(idTranca);
      if (!tranca) {
        return res.status(404).json({ error: 'Tranca não encontrada' });
      }

      tranca.status = 'EXCLUÍDA';
      await tranca.save();

      const formattedTranca = TrancaFormatter.format(tranca);
      return res.status(200).json({ message: 'Tranca removida com sucesso', tranca: formattedTranca });
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

      const bicicleta = tranca.Bicicleta || { message: 'Nenhuma bicicleta associada' };
      return res.status(200).json(bicicleta);
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

        tranca.bicicletaId = bicicletaId;
        bicicleta.status = 'trancada';
        await bicicleta.save();
      }

      await tranca.save();
      const formattedTranca = TrancaFormatter.format(tranca);

      return res.status(200).json(formattedTranca);
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

        tranca.bicicletaId = null;
        bicicleta.status = 'disponível';
        await bicicleta.save();
      }

      await tranca.save();
      const formattedTranca = TrancaFormatter.format(tranca);

      return res.status(200).json(formattedTranca);
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

      const formattedTranca = TrancaFormatter.format(tranca);
      return res.status(200).json(formattedTranca);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}

export default TrancaController;

// Classe para formatar os dados da tranca
class TrancaFormatter {
  static format(tranca) {
    const { idTotem, ...formattedTranca } = tranca.toJSON(); // Remove o idTotem
    return formattedTranca;
  }

  static formatAll(trancas) {
    return trancas.map((tranca) => TrancaFormatter.format(tranca));
  }
}
