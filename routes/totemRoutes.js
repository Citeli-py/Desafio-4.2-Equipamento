import express from 'express';
import TotemController from '../controllers/totemController.js';

const router = express.Router();

// listar todos os totens
router.get('/totem', TotemController.listarTotens);

// criar um novo totem
router.post('/totem', TotemController.criarTotem);

// atualizar um totem existente pelo ID
router.put('/totem/:idTotem', TotemController.atualizarTotem);

// deletar um totem pelo ID
router.delete('/totem/:idTotem', TotemController.deletarTotem);

// listar todas as trancas associadas a um totem
router.get('/totem/:idTotem/trancas', TotemController.listarTrancasDoTotem);

// listar todas as bicicletas associadas a um totem
router.get('/totem/:idTotem/bicicletas', TotemController.listarBicicletasDoTotem);

export default router;
