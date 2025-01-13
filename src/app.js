import express from 'express';
import bodyParser from 'body-parser';
import {DateTime} from 'luxon';

const app = express();
const PORT = 3004;

// Middleware para interpretar JSON
app.use(bodyParser.json());

// Middleware logs
app.use(function (req, res, next) {
  const agora = new DateTime(Date.now())
  console.log(agora.toFormat("dd/MM/yyyy - HH:mm:ss"), req.method, req.url, req.body);
  next();
});

import bicicletaRoutes from './routes/bicicletaRoutes.js';
import trancaRoutes from './routes/trancaRoutes.js';
import totemRoutes from './routes/totemRoutes.js'

// Rotas
app.use('/turma-node-grupo-4-equipamento/bicicleta', bicicletaRoutes);
app.use('/turma-node-grupo-4-equipamento/tranca', trancaRoutes);
app.use('/turma-node-grupo-4-equipamento/totem', totemRoutes);

import Database from './db/Database.js';

Database.init();
const res = await Database.autenticacao()
if(res.sucess) {

  // Sincronizar banco de dados e iniciar o servidor
  Database.conexao.sync({ force: false }) // Use { force: true } apenas para recriar tabelas ao desenvolver
    .then(() => {
      console.log('Database synced successfully.');
      app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
    })
    .catch(error => console.error('Error syncing database:', error));

}
else
  console.log(res.error);
