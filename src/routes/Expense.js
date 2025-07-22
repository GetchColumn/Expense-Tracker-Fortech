import express from 'express';
import { body, param, query, validationResult } from 'express-validator';

import { Expense } from '../models/expense.model.js';
import { Category } from '../models/category.model.js';

const router = express.Router();

// получение всех расходов
router.get('/expense', async (req, res) => {
  try {
    const result = await Expense.findAll();

    return res.status(200).send(result);

  } catch (error) {
    console.error(error);
    return res.status(503).send({ error: "Database temporarily unavailable" });
  }
});

// !!! получение расходов по выбранной категории
router.get('/expense', async (req, res) => {
  try {
    const allExpenses = await Expense.findAll();

    return res.status(200).send(allExpenses);

  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
});

// добавление расходов
router.post('/expense', body('sum', 'category', 'description').notEmpty(),
  async (req, res) => {
    const valid = validationResult(req);

    if (valid.isEmpty()) {
      const { sum: sum, category, description } = req.body;
      let categoryObject = null;

      try {

        categoryObject = await Category.findOne({ where: { name: category } });

        if (categoryObject === null) {
          return res.status(400).send({ message: "The specified category don't exist" });
        }

        const categoryId = categoryObject.id;
        const newExpense = await Expense.create({ sum, categoryId, description });

        return res.send(newExpense);

      } catch (error) {
        console.error(error);

        if (error.name === 'SequelizeConnectionError' || error.code === 'ECONNREFUSED') {
          return res.status(503).send({ error: 'Database temporarily unavailable' });
        }

        return res.status(500).send({ error: "Unexpected error" });
      }
    }

    res.send({ errors: valid.array() });
  });

// частичное обновление расходов
router.patch("/expense", async (req, res) => {
  res.status(200).send({});
});

export { router as expenseRoute }