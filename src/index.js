import express from 'express';
import { sequelize } from './config/database.js'

import { categoryRoute } from './routes/Category.js';
import { expenseRoute } from './routes/Expense.js';

const PORT = 8080;

const app = express();
app.use(express.json());

app.use("/api", categoryRoute);
app.use("/api", expenseRoute);

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
