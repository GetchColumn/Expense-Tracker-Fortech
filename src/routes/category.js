import express from 'express';

import { Category } from '../models/index.js';

import { validateRequestSchema } from '../middleware/validate-request-schema.js';
import { categorySchema } from '../middleware/category-schema.js';
import { categoryPutSchema } from '../middleware/category-put-schema.js';

import { CategoryController } from '../controllers/categoryController.js'

const router = express.Router();

router.get('/', CategoryController.getAllCategory);

router.get('/:id', CategoryController.getCategoryById);

router.post('/', categorySchema, CategoryController.createCategory);

router.put("/", categoryPutSchema, validateRequestSchema, CategoryController.updateFullCategory);

router.delete("/", categorySchema, validateRequestSchema, CategoryController.deleteCategory);

export { router as categoryRoute }