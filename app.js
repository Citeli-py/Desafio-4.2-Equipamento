const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./config/database');
const taskRoutes = require('./routes/taskRoutes');
const luxon = require('luxon');

const app = express();
const PORT = 3000;

// Middleware para interpretar JSON
app.use(bodyParser.json());

// Middleware logs
app.use(function (req, res, next) {
  const agora = new luxon.DateTime(Date.now())
  console.log(agora.toFormat("dd/MM/yyyy - HH:mm:ss"), req.method, req.url,);
  next();
});

// Rotas
app.use('/api/tasks', taskRoutes);

// Sincronizar banco de dados e iniciar o servidor
sequelize.sync({ force: false }) // Use { force: true } apenas para recriar tabelas ao desenvolver
  .then(() => {
    console.log('Database synced successfully.');
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  })
  .catch(error => console.error('Error syncing database:', error));