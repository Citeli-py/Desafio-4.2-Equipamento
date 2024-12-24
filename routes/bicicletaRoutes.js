const express = require('express');
const router = express.Router();

// Listar todas as bicicletas
router.get('/', (req, res) => func);

// Obter uma bicicleta pelo ID
router.get('/:id', (req, res) => func);

// Cadastrar nova bicicleta
router.post('/', (req, res) => func);

// Editar uma bicicleta pelo ID
router.put('/:id', (req, res) => func);

// Excluir uma bicicleta pelo ID
router.delete('/:id', (req, res) => func);

// Colocar uma bicicleta na rede
router.post('/integrarNaRede', (req, res) => func);

// Retirar uma bicicleta na rede
router.post('/retirarDaRede', (req, res) => func);

// Altera o status de uma bicicleta
router.post('/:id/status/:acao', (req, res) => func);

module.exports = router;