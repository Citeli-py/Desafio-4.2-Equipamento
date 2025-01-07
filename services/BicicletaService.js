import { DadoInvalido, DadoNaoEncontrado, ErroInterno } from '../util/erros.js';
import { BicicletaRepo } from '../repository/BicicletaRepo.js';
import { TrancaRepo } from '../repository/TrancaRepo.js';
import { AluguelApi } from '../api/aluguel.js'
import { InclusaoBicicletaRepo} from '../repository/InclusaoBicicletaRepo.js'
import { RetiradaBicicletaRepo } from '../repository/RetiradaBicicletaRepo.js';
import Database from '../db/Database.js'

export class BicicletaService {
  static async listarBicicletas() {
    return await BicicletaRepo.getAllBicicletas();
  }

  static async getBicicleta(id) {
    const bicicleta = await BicicletaRepo.getBicicleta(id);
    if (!bicicleta) {
      return { sucesso: false, erro: DadoNaoEncontrado, mensagem: 'Bicicleta não encontrada' };
    }
    return { 
      sucesso: true, 
      bicicleta: {
        id: bicicleta.id,
        marca: bicicleta.marca,
        modelo: bicicleta.modelo,
        ano: bicicleta.ano,
        numero: bicicleta.numero,
        status: bicicleta.status
      } 
    };
  }

  static async criarBicicleta(dados) {
    return await BicicletaRepo.criarBicicleta(dados);
  }

  static async atualizarBicicleta(id, dados) {
    const bicicleta = await BicicletaRepo.getBicicleta(id);
    if (!bicicleta) {
      return { sucesso: false, erro: DadoNaoEncontrado, mensagem: 'Bicicleta não encontrada' };
    }
    return await BicicletaRepo.atualizarBicicleta(bicicleta, dados);
  }

  static async deletarBicicleta(id) {
    const bicicleta = await BicicletaRepo.getBicicleta(id);
    if (!bicicleta) {
      return { sucesso: false, erro: DadoNaoEncontrado, mensagem: 'Bicicleta não encontrada' };
    }
    if (bicicleta.status !== 'APOSENTADA') {
      return { sucesso: false, erro: DadoNaoEncontrado, mensagem: 'Bicicleta não está aposentada' };
    }
    return await BicicletaRepo.deletarBicicleta(bicicleta);
  }

  static async alterarStatus(id, status){

    const bicicleta = await BicicletaRepo.getBicicleta(id)
    if (!bicicleta) 
        return { sucesso: false, erro: DadoNaoEncontrado, mensagem: 'Bicicleta não encontrada' };
    
    const acoes = ['DISPONIVEL','EM_USO', 'NOVA', 'APOSENTADA', 'REPARO_SOLICITADO', 'EM_REPARO']

    if (!acoes.includes(status))
      return { sucesso: false, erro: DadoInvalido, mensagem: 'Status inválido' };

    return BicicletaRepo.atualizarBicicleta(bicicleta, {status});
  }


  static async integrarNaRede(idTranca, idBicicleta, idFuncionario){
    /*
    Regras:
    - O número da bicicleta deve ter sido cadastrado previamente no sistema.
    - A bicicleta deve estar com status de “NOVA” ou “EM_REPARO”.
    - A tranca deve estar com o status “LIVRE”.
    - Devem ser registrados: a data/hora da inserção na tranca, o número da bicicleta e o número da tranca.
    */

    const bicicleta = await BicicletaRepo.getBicicleta(idBicicleta);
    if (!bicicleta) 
        return { sucesso: false, erro: DadoNaoEncontrado, mensagem: 'Bicicleta não encontrada' };

    // Se bicicleta não estiver nem NOVA nem EM_REPARO
    if (!['NOVA', 'EM_REPARO'].includes(bicicleta.status))
      return { sucesso: false, erro: DadoInvalido, mensagem: 'Bicicleta não está apta para integração' };

    const tranca = await TrancaRepo.getTranca(idTranca);
    if(!tranca)
      return { sucesso: false, erro: DadoNaoEncontrado, mensagem: 'Tranca não encontrada' };

    if(tranca.status !== "LIVRE")
      return { sucesso: false, erro: DadoInvalido, mensagem: 'Tranca não está livre' };

    const funcionario = await AluguelApi.getFuncionario(idFuncionario);
    if(!funcionario)
      return { sucesso: false, erro: DadoNaoEncontrado, mensagem: 'Funcionário não encontrado' };

    const transacao = await Database.createTransaction();

    try{
      await InclusaoBicicletaRepo.criarInclusao(bicicleta, tranca, transacao);
      await TrancaRepo.trancar(tranca, bicicleta, transacao);
      await transacao.commit();
    } catch(error){

      await transacao.rollback();
      throw error;
    }

    return {sucesso: true};
  }


  static async retirarDaRede(idTranca, idBicicleta, idFuncionario, statusAcaoReparador){
    // Um funcionário retira uma bicicleta da rede pela sua tranca, anotando data e hora
    /*
    Esse metodo deve abrir a tranca da bicicleta, fazer as alterações necessárias baseadas no statusAcaoReparador e anotar os dados da retirada

    Regras:
    - O número da bicicleta deve ter sido cadastrado previamente no sistema
    - A bicicleta deve estar presa em uma tranca e com status 'REPARO_SOLICITADO'.
    - Devem ser registrados: a data/hora da retirada da tranca, a matrícula do reparador e o número da bicicleta.
    */

    //encapsular respostas
    const bicicleta = await BicicletaRepo.getBicicleta(idBicicleta);
    if (!bicicleta) 
      return { sucesso: false, erro: DadoInvalido, mensagem: 'Bicicleta não encontrada' };

    if(bicicleta.status !== "REPARO_SOLICITADO")
      return { sucesso: false, erro: DadoInvalido, mensagem: 'Bicicleta não teve o reparo solicitado' };

    const tranca = await TrancaRepo.getTranca(idTranca);
    if(!tranca)
      return { sucesso: false, erro: DadoInvalido, mensagem: 'Tranca não encontrada' };

    if(!TrancaRepo.isBicicletaNaTranca(tranca, bicicleta))
      return { sucesso: false, erro: DadoInvalido, mensagem: 'Bicicleta não está presa na tranca informada' };

    const funcionario = await AluguelApi.getFuncionario(idFuncionario);
    if(!funcionario)
        return { sucesso: false, erro: DadoInvalido, mensagem: 'Funcionário não encontrado' };

    if(!["REPARO", "APOSENTADORIA"].includes(statusAcaoReparador))
        return { sucesso: false, erro: DadoInvalido, mensagem: 'Ação do reparador inválida' };

    
    const transacao = await Database.createTransaction();

    try{
      await RetiradaBicicletaRepo.criarRetirada(bicicleta, funcionario, transacao);
      await BicicletaRepo.acaoReparador(bicicleta, statusAcaoReparador, transacao);
      await TrancaRepo.destrancar(tranca, transacao);

      await transacao.commit();
    } catch(error){

      await transacao.rollback();
      throw error;
    }
    
    return { sucesso: true};
  }
}
