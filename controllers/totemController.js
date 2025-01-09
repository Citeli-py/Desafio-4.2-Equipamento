import { Sucesso, ErroInterno, ErroNaoEncontrado, ErroDadoInvalido } from '../util/responseHandler.js';
import { Op } from 'sequelize';

import { Totem } from '../models/Totem.js';
import { Tranca } from '../models/Tranca.js';
import { Bicicleta } from '../models/Bicicleta.js';

export class TotemController {
  // Criar um novo totem
  static async criarTotem(req, res) {
    try {
      const { localizacao, descricao } = req.body;

      if (!localizacao) {
        return ErroDadoInvalido.toResponse(res, '422', 'O campo "localizacao" é obrigatório.');
      }

      const novoTotem = await Totem.create({ localizacao, descricao });
      return Sucesso.toResponse(res, novoTotem, 201);
    } catch (error) {
      return ErroInterno.toResponse(res, '500', error, 'Criar Totem');
    }
  }

  // Listar todos os totens
  static async listarTotens(req, res) {
    try {
      const totens = await Totem.findAll({
        attributes: ['id', 'localizacao', 'descricao'],
      });
      return Sucesso.toResponse(res, totens);
    } catch (error) {
      return ErroInterno.toResponse(res, '500', error, 'Listar Totens');
    }
  }

  // Buscar um totem pelo ID
  static async buscarTotemPorId(req, res) {
    try {
      const { idTotem } = req.params;

      const totem = await Totem.findByPk(idTotem, {
        attributes: ['id', 'localizacao', 'descricao'],
      });

      if (!totem) {
        return ErroNaoEncontrado.toResponse(res, '404', 'Totem não encontrado.');
      }

      return Sucesso.toResponse(res, totem);
    } catch (error) {
      return ErroInterno.toResponse(res, '500', error, 'Buscar Totem por ID');
    }
  }

  // Atualizar um totem existente pelo ID
  static async atualizarTotem(req, res) {
    try {
      const { idTotem } = req.params;
      const { localizacao, descricao } = req.body;

      if (!localizacao || !descricao) {
        return ErroDadoInvalido.toResponse(res, '422', 'Campos "localizacao" e "descricao" são obrigatórios.');
      }

      const totem = await Totem.findByPk(idTotem);
      if (!totem) {
        return ErroNaoEncontrado.toResponse(res, '404', 'Totem não encontrado.');
      }

      await totem.update({ localizacao, descricao });
      return Sucesso.toResponse(res, totem);
    } catch (error) {
      return ErroInterno.toResponse(res, '500', error, 'Atualizar Totem');
    }
  }

  // Deletar um totem pelo ID
  static async deletarTotem(req, res) {
    try {
      const { idTotem } = req.params;

      const totem = await Totem.findByPk(idTotem);
      if (!totem) {
        return ErroNaoEncontrado.toResponse(res, '404', 'Totem não encontrado.');
      }

      await totem.destroy();
      return Sucesso.toResponse(res, {});
    } catch (error) {
      return ErroInterno.toResponse(res, '500', error, 'Deletar Totem');
    }
  }

  // Associar tranca a um totem
  static async associarTranca(req, res) {
    try {
      const { idTotem, idTranca } = req.params;
  
      if (!idTotem || !idTranca) {
        return ErroDadoInvalido.toResponse(res, '422', 'IDs de totem e tranca são obrigatórios.');
      }
  
      const totem = await Totem.findByPk(idTotem);
      if (!totem) {
        return ErroNaoEncontrado.toResponse(res, '404', 'Totem não encontrado.');
      }
  
      const tranca = await Tranca.findByPk(idTranca);
      if (!tranca) {
        return ErroNaoEncontrado.toResponse(res, '404', 'Tranca não encontrada.');
      }
  
      if (tranca.idTotem && tranca.idTotem !== parseInt(idTotem, 10)) {
        return ErroDadoInvalido.toResponse(
          res,
          '422',
          `A tranca já está associada ao Totem ID ${tranca.idTotem}.`
        );
      }
      tranca.idTotem = idTotem;
      await tranca.save();
  
      return Sucesso.toResponse(res, {
        message: 'Tranca associada com sucesso ao totem.',
        tranca: {
          id: tranca.id,
          idTotem: tranca.idTotem,
        },
      });
    } catch (error) {
      return ErroInterno.toResponse(res, '500', error, 'Associar Tranca ao Totem');
    }
  }

  // Listar todas as trancas de um totem
static async listarTrancasDoTotem(req, res) {
  try {
    const { idTotem } = req.params;

    // Validar o ID do totem
    if (!idTotem) {
      return ErroDadoInvalido.toResponse(res, '422', 'ID do totem é obrigatório.');
    }

    // Verificar se o totem existe
    const totem = await Totem.findByPk(idTotem);
    if (!totem) {
      return ErroNaoEncontrado.toResponse(res, '404', 'Totem não encontrado.');
    }

    // Buscar as trancas associadas ao totem
    const trancas = await Tranca.findAll({
      where: { idTotem },
      attributes: ['id', 'status', 'modelo'], 
    });

    if (!trancas.length) {
      return ErroNaoEncontrado.toResponse(res, '404', 'Nenhuma tranca associada a este totem.');
    }

    return Sucesso.toResponse(res, {
      message: 'Trancas encontradas com sucesso.',
      trancas,
    });
  } catch (error) {
    return ErroInterno.toResponse(res, '500', error, 'Listar Trancas do Totem');
  }
}

  // Listar bicicletas de um totem
static async listarBicicletasDoTotem(req, res) {
  try {
    const { idTotem } = req.params;

    const totem = await Totem.findByPk(idTotem);
    if (!totem) {
      return ErroNaoEncontrado.toResponse(res, '404', 'Totem não encontrado.');
    }

    // Buscar as trancas associadas ao Totem
    const trancas = await Tranca.findAll({
      where: { idTotem },
      attributes: ['id'], 
    });

    if (!trancas.length) {
      return ErroNaoEncontrado.toResponse(res, '404', 'Nenhuma tranca associada a este totem.');
    }

    // Buscar as bicicletas associadas às trancas
    const bicicletas = await Bicicleta.findAll({
      include: [
        {
          model: Tranca,
          as: 'tranca',
          where: {
            id: {
              [Op.in]: trancas.map((tranca) => tranca.id),
            },
          },
          attributes: [], 
        },
      ],
      attributes: ['id', 'marca', 'modelo', 'ano', 'numero', 'status'], 
    });

    return Sucesso.toResponse(res, bicicletas);
  } catch (error) {
    return ErroInterno.toResponse(res, '500', error, 'Listar Bicicletas do Totem');
  }
}

  
}

export default TotemController;