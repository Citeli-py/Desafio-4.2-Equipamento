import { Tranca } from '../models/Tranca.js';
import { Bicicleta } from '../models/Bicicleta.js'; 

import { ErroDadoInvalido, ErroInterno, ErroNaoEncontrado, Sucesso } from '../util/responseHandler.js';

import { TrancaService } from '../services/TrancaService.js';

export class TrancaController {

  // Recuperar todas as trancas
  static async listarTrancas(req, res) {
    try {
      const trancas = await TrancaService.listarTrancas();
      return Sucesso.toResponse(res, trancas);
    } catch (error) {
      return ErroInterno.toResponse(res, '500', error, 'Listar Trancas');
    }
  }

  // Obter uma tranca específica
  static async obterTranca(req, res) {
    try {
      const { idTranca } = req.params;

      const resposta = await TrancaService.obterTranca(idTranca);
      if (!resposta.sucesso) 
        return ErroNaoEncontrado.toResponse(res, "404", resposta.mensagem);

      return Sucesso.toResponse(res, resposta.tranca);
    } catch (error) {
      return ErroInterno.toResponse(res, '500', error, 'Obter Tranca');
    }
  }

  // Cadastrar uma nova tranca
  static async criarTranca(req, res) {
    try {
      const { numero, localizacao, anoDeFabricacao, modelo, status } = req.body;

      const resposta = await TrancaService.criarTranca(numero, localizacao, anoDeFabricacao, modelo, status);

      console.log(resposta)
      if(!resposta.sucesso)
        return ErroDadoInvalido.toResponse(res, "422", resposta.mensagem);

      return Sucesso.toResponse(res, resposta.tranca);
    } catch (error) {
      return ErroInterno.toResponse(res, '500', error, 'Criar Tranca');
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

      await tranca.destroy();
      return res.status(200).json({ message: 'Tranca removida com sucesso' });
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
        const bicicleta = await Bicicleta.getBicicleta(bicicletaId);
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
        const bicicleta = await Bicicleta.getBicicleta(bicicletaId);
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


