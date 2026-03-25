import { query } from 'express-validator';

const schema = [
  query('category')
    .trim()
    .notEmpty()
    .withMessage("Category name cannot be empty")
]

export { schema as expenseGetByCategory }