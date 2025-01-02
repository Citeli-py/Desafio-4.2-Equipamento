import express from 'express';
import { TrancaController } from '../controllers/trancaController.js';

const router = express.Router();

// Listar todas as trancas
router.get('/', (req, res) => TrancaController.listarTrancas(req, res));

// Obter uma tranca pelo ID
router.get('/:idTranca', (req, res) => TrancaController.obterTranca(req, res));

// Cadastrar nova tranca
router.post('/', (req, res) => TrancaController.criarTranca(req, res));

// Editar uma tranca pelo ID
router.put('/:idTranca', (req, res) => TrancaController.atualizarTranca(req, res));

// Excluir uma tranca pelo ID
router.delete('/:idTranca', (req, res) => TrancaController.deletarTranca(req, res));

// Obter bicicleta na tranca
router.get('/:idTranca/bicicleta', (req, res) => TrancaController.obterBicicletaNaTranca(req, res));

// Trancar tranca
router.post('/:idTranca/trancar', (req, res) => TrancaController.trancarTranca(req, res));

// Destrancar tranca
router.post('/:idTranca/destrancar', (req, res) => TrancaController.destrancarTranca(req, res));

// Colocar uma tranca na rede
router.post('/integrarNaRede', (req, res) => TrancaController.integrarNaRede(req, res));

// Retirar uma tranca na rede
router.post('/retirarDaRede', (req, res) => TrancaController.retirarDaRede(req, res));

// Altera o status de uma tranca
router.post('/:idTranca/status/:acao', (req, res) => TrancaController.alterarStatus(req, res));

export default router;