import express from 'express';
import { TotemController } from '../controllers/totemController.js';

const router = express.Router();

// listar todos os totens
router.get('/', (req, res) => TotemController.listarTotens(req, res));

// criar um novo totem
router.post('/', (req, res) => TotemController.criarTotem(req, res));

// Obter um totem 
router.get('/:idTotem', (req, res) => TotemController.buscarTotemPorId(req, res));

// atualizar um totem existente pelo ID
router.put('/:idTotem', (req, res) => TotemController.atualizarTotem(req, res));

// deletar um totem pelo ID
router.delete('/:idTotem', (req, res) => TotemController.deletarTotem(req, res));

// listar todas as trancas associadas a um totem
router.get('/:idTotem/trancas', (req, res) => TotemController.listarTrancasDoTotem(req, res));

// listar todas as bicicletas associadas a um totem
router.get('/:idTotem/bicicletas', (req, res) => TotemController.testListarBicicletasDoTotem(req, res));

export default router;
