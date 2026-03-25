import express from 'express';

import { expenseSchema } from '../middleware/expense-schema.js'

import { ExpenseController } from '../controllers/expenseController.js'

const router = express.Router();

router.get('/', ExpenseController.getAllExpense);

router.get('/by-category', ExpenseController.getExpenseByCategory);

router.get('/by-period', ExpenseController.getExpenseByPeriod);

router.post('/', expenseSchema, ExpenseController.addExpense);

router.delete("/", expenseSchema, ExpenseController.deleteExpense);

export { router as expenseRoute }