import { Totem } from '../models/Totem.js';

export class TotemController {
  // Criar um novo totem
  static async criarTotem(req, res) {
    try {
      const { localizacao, descricao } = req.body;

      // Verificar se os campos obrigatórios estão presentes
      if (!localizacao) {
        return res.status(422).json({ error: 'O campo "localizacao" é obrigatório.' });
      }

      // Criar o novo totem no banco de dados
      const novoTotem = await Totem.create({ localizacao, descricao });

      // Retornar o novo totem criado
      return res.status(201).json(novoTotem);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Listar todos os totens
  static async listarTotens(req, res) {
    try {
      // Buscar todos os totens no banco de dados
      const totens = await Totem.findAll({
        attributes: ['id', 'localizacao', 'descricao'], // Garantir que apenas os campos do esquema sejam retornados
      });

      // Retornar a lista de totens
      return res.status(200).json(totens);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Atualizar um totem existente pelo ID (mantido como referência)
  static async atualizarTotem(req, res) {
    try {
      const { idTotem } = req.params;
      const { localizacao, descricao } = req.body;

      const totem = await Totem.findByPk(idTotem);
      if (!totem) {
        return res.status(404).json({ error: 'Não Encontrado' });
      }

      if (!localizacao || !descricao) {
        return res.status(422).json({ error: 'Dados inválidos' });
      }

      await totem.update({ localizacao, descricao });

      return res.status(200).json({ message: 'Dados Cadastrados', totem });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Deletar um totem pelo ID (mantido como referência)
  static async deletarTotem(req, res) {
    try {
      const { idTotem } = req.params;

      const totem = await Totem.findByPk(idTotem);
      if (!totem) {
        return res.status(404).json({ error: 'Totem não encontrado' });
      }

      await totem.destroy();
      return res.status(200).json({ message: 'Totem removido' });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Faltam os endpoints que associam totens com trancas (a serem implementados)
}

export default TotemController;
