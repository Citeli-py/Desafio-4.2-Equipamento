import express from 'express';
import { BicicletaController } from '../controllers/bicicletaController.js';

const router = express.Router();

// Listar todas as bicicletas
router.get('/', (req, res) => BicicletaController.listarBicicletas(req, res));

// Obter uma bicicleta pelo ID
router.get('/:id', (req, res) => BicicletaController.obterBicicleta(req, res));

// Cadastrar nova bicicleta
router.post('/', (req, res) => BicicletaController.criarBicicleta(req, res));

// Editar uma bicicleta pelo ID
router.put('/:id', (req, res) => BicicletaController.atualizarBicicleta(req, res));

// Excluir uma bicicleta pelo ID
router.delete('/:id', (req, res) => BicicletaController.deletarBicicleta(req, res));

// Colocar uma bicicleta na rede
router.post('/integrarNaRede', (req, res) => BicicletaController.listarBicicletas(req, res));

// Retirar uma bicicleta na rede
router.post('/retirarDaRede', (req, res) => BicicletaController.listarBicicletas(req, res));

// Altera o status de uma bicicleta
router.post('/:id/status/:acao', (req, res) => BicicletaController.alterarStatus(req, res));

export default router;