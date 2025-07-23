import { body } from 'express-validator';

const schema = [
body('name').trim().notEmpty().withMessage("Category name cannot be empty")
]

export { schema as categoryDeleteSchema }