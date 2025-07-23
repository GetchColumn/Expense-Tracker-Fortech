import { query, body } from 'express-validator';

const schema = [
  query('name').trim().notEmpty().withMessage("Category name cannot be empty"),
  body('newName').trim()
    .notEmpty().withMessage("New category name cannot be empty"),
]

export { schema as categoryPutSchema }