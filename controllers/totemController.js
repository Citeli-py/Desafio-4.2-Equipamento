import { Totem } from '../models/Totem.js';

export class TotemController {
  // criar novo totem
  static async criarTotem(req, res) {
    try {
      const { localizacao, status } = req.body;

      const novoTotem = await Totem.create({ localizacao, status });

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
}

export default TotemController;
