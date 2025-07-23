import express from 'express';

import { Category } from '../models/category.model.js';

import { validateRequestSchema } from '../middleware/validate-request-schema.js';
import { categoryPostSchema } from '../schema/category-post-schema.js';
import { categoryPutSchema } from '../schema/category-put-schema.js';
import { categoryDeleteSchema } from '../schema/category-delete-schema.js';

const router = express.Router();

// получение списка всех категорий
router.get('/category', async (req, res) => {
  try {

    const allCategories = await Category.findAll()

    if (allCategories.length === 0) {
      return res.status(404).send({ message: "Not found" });
    }
    
    res.send(allCategories);

  } catch (error) {
    console.error(error);
    return res.status(503).send({ error: "Database temporarily unavailable" });
  }
});

// получение категории по id
router.get('/category/:id',
  async (req, res) => {
    try {
      const { id } = req.params;
      const categoryById = await Category.findByPk(id);

      if (categoryById === null) {
        return res.status(404).send({ message: "Not found" });
      }

      res.send(categoryById);

    } catch (error) {
      console.error(error);
      return res.status(503).send({ error: "Database temporarily unavailable" });
    }
  });

// добавление новой категории
router.post('/category', categoryPostSchema, validateRequestSchema,
  async (req, res) => {

    const { name } = req.body;

    try {
      const newCategory = await Category.create({ name });
      return res.send(newCategory);

    } catch (error) {
      console.error(error);

      if (error.name === 'SequelizeConnectionError' || error.code === 'ECONNREFUSED') {
        return res.status(503).send({ error: 'Database temporarily unavailable' });
      }

      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(409).send({ error: 'Category name already exists' });
      }

      return res.status(500).send({ error: "Unexpected error" });
    }

  });

// полное обновление категории
router.put("/category", categoryPutSchema, validateRequestSchema,
  async (req, res) => {

    const { name } = req.query;
    const { newName } = req.body;

    try {
      const categoryToUpdate = await Category.findOne({ where: { name: name } });

      if (categoryToUpdate === null) {
        return res.status(404).send({ message: "Not found" });
      }

      await categoryToUpdate.update({ name: newName });
      return res.send(await Category.findOne({ where: { name: newName } }));

    } catch (error) {
      console.error(error);

      if (error.name === 'SequelizeConnectionError' || error.code === 'ECONNREFUSED') {
        return res.status(503).send({ error: 'Database temporarily unavailable' });
      }

      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(409).send({ error: 'Category name already exists' });
      }

      return res.status(500).send({ error: "Unexpected error" });
    }

  });


// удаление (мягкое) категории
router.delete("/category", categoryDeleteSchema, validateRequestSchema,
  async (req, res) => {

    const { name } = req.body;

    try {
      const categoryToDelete = await Category.findOne({ where: { name: name } });

      if (categoryToDelete === null) {
        return res.status(404).send({ message: "Not found" });
      }

      await Category.destroy({ where: { name: name } });
      return res.send(categoryToDelete);

    } catch (error) {
      console.error(error);

      if (error.name === 'SequelizeConnectionError' || error.code === 'ECONNREFUSED') {
        return res.status(503).send({ error: 'Database temporarily unavailable' });
      }

      return res.status(500).send({ error: "Unexpected error" });
    }

  });

export { router as categoryRoute }