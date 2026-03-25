import { query, body } from 'express-validator';
import { validateRequestSchema } from './validate-request-schema.js';

const schema = [
  query('name')
    .trim()
    .notEmpty()
    .withMessage("Category name cannot be empty"),
  body('newName')
    .trim()
    .notEmpty()
    .withMessage("New category name cannot be empty"),
    validateRequestSchema
]

export { schema as categoryPutSchema }