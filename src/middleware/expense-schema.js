import { body } from 'express-validator';
import { validateRequestSchema } from './validate-request-schema.js';

const schema = [
  body('sum')
    .trim()
    .notEmpty()
    .withMessage("Category name cannot be empty"),
    validateRequestSchema
]

export { schema as expenseSchema }