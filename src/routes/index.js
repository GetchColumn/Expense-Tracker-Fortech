import express from 'express';
import { categoryRoute } from './category.js';
import { expenseRoute } from './expense.js';

const router = express.Router();

router.use("/api/category", categoryRoute);
router.use("/api/expense", expenseRoute);

export { router as mainRouter }