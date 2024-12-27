import express from 'express';
import bodyParser from 'body-parser';
import bicicletaRoutes from './routes/bicicletaRoutes.js';
import {DateTime} from 'luxon';

const app = express();
const PORT = 3000;

// Middleware para interpretar JSON
app.use(bodyParser.json());

// Middleware logs
app.use(function (req, res, next) {
  const agora = new DateTime(Date.now())
  console.log(agora.toFormat("dd/MM/yyyy - HH:mm:ss"), req.method, req.url,);
  next();
});

// Rotas
app.use('/bicicleta', bicicletaRoutes);

import Database from './db/Database.js';

Database.init();
const res = await Database.autenticacao()

// Sincronizar banco de dados e iniciar o servidor
Database.conexao.sync({ force: true }) // Use { force: true } apenas para recriar tabelas ao desenvolver
  .then(() => {
    console.log('Database synced successfully.');
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  })
  .catch(error => console.error('Error syncing database:', error));