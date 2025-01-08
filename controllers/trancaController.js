import { Tranca } from '../models/Tranca.js';
import { Bicicleta } from '../models/Bicicleta.js'; 

import { ErroDadoInvalido, ErroInterno, ErroNaoEncontrado, Sucesso } from '../util/responseHandler.js';

import { TrancaService } from '../services/TrancaService.js';
import { DadoInvalido, DadoNaoEncontrado } from '../util/erros.js';

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

      const resposta = await TrancaService.editarTranca(idTranca, numero, localizacao, anoDeFabricacao, modelo, status);
      if (!resposta.sucesso && resposta.erro === DadoNaoEncontrado) 
        return ErroNaoEncontrado.toResponse(res, "404", resposta.mensagem);

      if(!resposta.sucesso && resposta.erro === DadoInvalido)
        return ErroDadoInvalido.toResponse(res, "422", resposta.mensagem);

      return Sucesso.toResponse(res, resposta.tranca);
    } catch (error) {
      return ErroInterno.toResponse(res, '500', error, 'Atualizar Tranca');
    }
  }

  // Remover uma tranca
  static async deletarTranca(req, res) {
    try {
      const { idTranca } = req.params;

      const resposta = await TrancaService.deletarTranca(idTranca);

      if (!resposta.sucesso && resposta.erro === DadoNaoEncontrado) 
        return ErroNaoEncontrado.toResponse(res, "404", resposta.mensagem);
      
      if (!resposta.sucesso && resposta.erro === DadoInvalido)
        return ErroDadoInvalido.toResponse(res, "404", resposta.mensagem);

      return Sucesso.toResponse(res, resposta.tranca);
      
    } catch (error) {
      return ErroInterno.toResponse(res, '500', error, 'Deletar Tranca');
    }
  }

  // Obter bicicleta na tranca
  static async obterBicicletaNaTranca(req, res) {
    try {
      const { idTranca } = req.params;

      const resposta = await TrancaService.obterBicicleta(idTranca);
      if (!resposta.sucesso && resposta.erro === DadoNaoEncontrado) 
        return ErroNaoEncontrado.toResponse(res, "404", resposta.mensagem);
      
      if (!resposta.sucesso && resposta.erro === DadoInvalido)
        return ErroDadoInvalido.toResponse(res, "422", resposta.mensagem);


      return Sucesso.toResponse(res, resposta.bicicleta);
    } catch (error) {
      return ErroInterno.toResponse(res, '500', error, 'Obter bicicleta na tranca');
    }
  }

  // Trancar a tranca
  static async trancarTranca(req, res) {
    try {
      const { idTranca } = req.params;
      const { bicicleta } = req.body;

      const resposta = await TrancaService.trancarTranca(idTranca, bicicleta);

      if (!resposta.sucesso && resposta.erro === DadoNaoEncontrado) 
        return ErroNaoEncontrado.toResponse(res, "404", resposta.mensagem);
      
      if (!resposta.sucesso && resposta.erro === DadoInvalido)
        return ErroDadoInvalido.toResponse(res, "422", resposta.mensagem);

      return Sucesso.toResponse(res, resposta.tranca);
    } catch (error) {
      return ErroInterno.toResponse(res, "500", error, "Trancar Tranca");
    }
  }

  // Destrancar a tranca
  static async destrancarTranca(req, res) {
    try {
      const { idTranca } = req.params;
      const { bicicleta } = req.body;

      const resposta = await TrancaService.destrancarTranca(idTranca, bicicleta);

      if (!resposta.sucesso && resposta.erro === DadoNaoEncontrado) 
        return ErroNaoEncontrado.toResponse(res, "404", resposta.mensagem);
      
      if (!resposta.sucesso && resposta.erro === DadoInvalido)
        return ErroDadoInvalido.toResponse(res, "422", resposta.mensagem);

      return Sucesso.toResponse(res, resposta.tranca);
    } catch (error) {
      return ErroInterno.toResponse(res, "500", error, "Destrancar Tranca");
    }
  }

  // Alterar status da tranca
  static async alterarStatusTranca(req, res) {
    try {
      const { idTranca, acao } = req.params;

      const resposta = await TrancaService.alterarStatus(idTranca, acao);

      if (!resposta.sucesso && resposta.erro === DadoNaoEncontrado) 
        return ErroNaoEncontrado.toResponse(res, "404", resposta.mensagem);
      
      if (!resposta.sucesso && resposta.erro === DadoInvalido)
        return ErroDadoInvalido.toResponse(res, "422", resposta.mensagem);

      return Sucesso.toResponse(res, resposta.tranca);

    } catch (error) {
      return ErroInterno.toResponse(res, "500", error, "Alterar status Tranca");
    }
  }

  static async integrarNaRede(req, res){
    try {
      const { idTranca, idTotem, idFuncionario } = req.body;

      const resposta = await TrancaService.integrarNaRede(idTotem, idTranca, idFuncionario);

      if (!resposta.sucesso && resposta.erro === DadoNaoEncontrado) 
        return ErroDadoInvalido.toResponse(res, "404", resposta.mensagem);
      
      if (!resposta.sucesso && resposta.erro === DadoInvalido)
        return ErroDadoInvalido.toResponse(res, "422", resposta.mensagem);

      return Sucesso.toResponse(res, {});

    } catch (error) {
      return ErroInterno.toResponse(res, "500", error, "Integrar tranca na rede");
    }
  }
}

export default TrancaController;


