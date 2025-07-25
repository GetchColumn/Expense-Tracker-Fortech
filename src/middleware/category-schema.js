import { body } from 'express-validator';
import { validateRequestSchema } from './validate-request-schema.js';

const schema = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage("Category name cannot be empty"),
    validateRequestSchema
]

export { schema as categorySchema }