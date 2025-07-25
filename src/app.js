import express from 'express';
import { sequelize } from './config/database.js'
import dotenv from 'dotenv';

import { mainRouter } from './routes/index.js';

dotenv.config();

const PORT = process.env.APP_PORT;

const app = express();
app.use(express.json());

app.use('/', mainRouter);

try {
  await sequelize.authenticate();
  await sequelize.sync({ force: true })
  app.listen(PORT, () =>
    console.log(`It's alive on http://localhost:${PORT}`),
  );
} catch (err) {
  console.log(err);
  process.exit(1);
}
