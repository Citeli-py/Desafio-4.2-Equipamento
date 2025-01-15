import express from 'express';
import { RestaurarBancoController } from '../controllers/restaurarBancoController.js';

const router = express.Router();

// Restaura o banco de dados
router.get('/', (req, res) => RestaurarBancoController.restaurarBanco(req, res));

export default router;