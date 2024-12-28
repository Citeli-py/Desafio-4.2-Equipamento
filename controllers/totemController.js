import { Totem } from '../models/Totem.js';

export class TotemController {
  // criar novo totem
  static async criarTotem(req, res) {
    try {
      const { localizacao, descricao } = req.body;

      const novoTotem = await Totem.create({ localizacao, descricao });

      return res.status(201).json(novoTotem);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // listar todos os totens
  static async listarTotens(req, res) {
    try {
      const totens = await Totem.findAll();
      return res.status(200).json(totens);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // atualizar um totem existente pelo ID
  static async atualizarTotem(req, res) {
    try {
      const { idTotem } = req.params; 
      const { localizacao, descricao } = req.body; 

      // Usando função nativa do sequelize para buscar por ID
      const totem = await Totem.findByPk(idTotem);
      if (!totem) {
        return res.status(404).json({ error: 'Totem não encontrado' });
      }

      // Atualizando os campos do totem
      await totem.update({ localizacao, descricao });

      return res.status(200).json(totem); 
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}

export default TotemController;
