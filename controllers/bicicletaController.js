import { Sucesso, ErroInterno, ErroNaoEncontrado, ErroDadoInvalido } from '../util/responseHandler.js';
import { BicicletaService } from '../services/BicicletaService.js';
import { DadoInvalido, DadoNaoEncontrado } from '../util/erros.js';

export class BicicletaController {
  static async listarBicicletas(req, res) {
    try {
      const bicicletas = await BicicletaService.listarBicicletas();
      return Sucesso.toResponse(res, bicicletas);
    } catch (error) {
      return ErroInterno.toResponse(res, '500', error, 'Listar Bicicletas');
    }
  }

  static async obterBicicleta(req, res) {
    try {
      const { id } = req.params;
      const resposta = await BicicletaService.getBicicleta(id);
      if (!resposta.sucesso) {
        return ErroNaoEncontrado.toResponse(res, '404', resposta.mensagem);
      }
      return Sucesso.toResponse(res, resposta.bicicleta);
    } catch (error) {
      return ErroInterno.toResponse(res, '500', error, 'Obter Bicicleta');
    }
  }

  static async criarBicicleta(req, res) {
    try {
      const resposta = await BicicletaService.criarBicicleta(req.body);
      if (!resposta.sucesso) {
        return ErroNaoEncontrado.toResponse(res, '422', resposta.mensagem);
      }
      return Sucesso.toResponse(res, resposta.bicicleta);
    } catch (error) {
      return ErroInterno.toResponse(res, '500', error, 'Criar Bicicleta');
    }
  }

  static async atualizarBicicleta(req, res) {
    try {
      const { id } = req.params;
      const resposta = await BicicletaService.atualizarBicicleta(id, req.body);
      if (!resposta.sucesso) {
        return ErroNaoEncontrado.toResponse(res, '422', resposta.mensagem);
      }
      return Sucesso.toResponse(res, resposta.bicicleta);
    } catch (error) {
      return ErroInterno.toResponse(res, '500', error, 'Atualizar Bicicleta');
    }
  }

  static async deletarBicicleta(req, res) {
    try {
      const { id } = req.params;
      const resposta = await BicicletaService.deletarBicicleta(id);
      if (!resposta.sucesso) {
        return ErroNaoEncontrado.toResponse(res, '422', resposta.mensagem);
      }
      return Sucesso.toResponse(res, {});
    } catch (error) {
      return ErroInterno.toResponse(res, '500', error, 'Deletar Bicicleta');
    }
  }

  static async integrarNaRede(req, res){
    /*
    Regras:
    - O número da bicicleta deve ter sido cadastrado previamente no sistema.
    - A bicicleta deve estar com status de “NOVA” ou “EM_REPARO”.
    - A tranca deve estar com o status “LIVRE”.
    - Devem ser registrados: a data/hora da inserção na tranca, o número da bicicleta e o número da tranca.
    */

  try {
    const { idTranca, idBicicleta, idFuncionario } = req.body;

    const resposta = await BicicletaService.integrarNaRede(idTranca, idBicicleta, idFuncionario);

    if(!resposta.sucesso && resposta.erro === DadoNaoEncontrado)
      return ErroNaoEncontrado.toResponse(res, "404", resposta.mensagem);

    if(!resposta.sucesso && resposta.erro === DadoInvalido)
      return ErroDadoInvalido.toResponse(res, "422", resposta.mensagem);

    return Sucesso.toResponse(res, {});

  } catch (error) {
    return ErroInterno.toResponse(res, "500", error, "integrar Bicicleta na rede");
  }
  }

  static async retirarDaRede(req, res){
    try{
        const {idTranca, idBicicleta, idFuncionario, statusAcaoReparador} = req.body;

        const resposta = await BicicletaService.retirarDaRede(idTranca, idBicicleta, idFuncionario, statusAcaoReparador);

        if(!resposta.sucesso && resposta.erro === DadoNaoEncontrado)
          return ErroDadoInvalido.toResponse(res, "404", resposta.mensagem);

        if(!resposta.sucesso && resposta.erro === DadoInvalido)
          return ErroDadoInvalido.toResponse(res, "422", resposta.mensagem);

        return Sucesso.toResponse(res, {})

    } catch (error){
        return ErroInterno.toResponse(res, "500", error, "Retirar bicicleta da Rede");
    }
  }

  static async alterarStatus(req, res){
    try{
      const {id, acao} = req.params;

      const repostaAlterarStatus = await BicicletaService.alterarStatus(id, acao);

      if (!repostaAlterarStatus.sucesso && repostaAlterarStatus.erro === DadoNaoEncontrado) 
        return ErroNaoEncontrado.toResponse(res, "404", repostaAlterarStatus.mensagem);

      if (!repostaAlterarStatus.sucesso && repostaAlterarStatus.erro === DadoInvalido) 
        return ErroDadoInvalido.toResponse(res, "422", repostaAlterarStatus.mensagem);
      
      return Sucesso.toResponse(res, repostaAlterarStatus.bicicleta);

    }catch (error){
      return ErroInterno.toResponse(res, "500", error, "alterar status da bicicleta");
    }
  }
}
