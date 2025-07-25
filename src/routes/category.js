import express from 'express';

import { Category } from '../models/category.model.js';

import { validateRequestSchema } from '../middleware/validate-request-schema.js';
import { categorySchema } from '../middleware/category-schema.js';
import { categoryPutSchema } from '../middleware/category-put-schema.js';

import { CategoryController } from '../controllers/categoryController.js'

const router = express.Router();

// получение списка всех категорий
router.get('/', async (req, res) => {
  try {

    const allCategories = await Category.findAll()

    res.send(allCategories);

  } catch (error) {
    console.error(error);
    return res.status(503).send({ error: "Database temporarily unavailable" });
  }
});

// получение категории по id
router.get('/:id',
  async (req, res) => {
    try {
      const { id } = req.params;
      const categoryById = await Category.findByPk(id);

      if (categoryById === null) {

        // throw
        return res.status(404).send({ message: "Not found" });
      }

      res.send(categoryById);

    } catch (error) {
      console.error(error);
      return res.status(400).send({ error: "Unable to get catedory" });
    }
  });

// добавление новой категории
router.post('/', categorySchema,
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

      return res.status(400).send({ error: "Unable to create new entry" });
    }

  });

// полное обновление категории
router.put("/", categoryPutSchema, validateRequestSchema,
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

      return res.status(400).send({ error: "Unable to update entry" });
    }

  });


// удаление (мягкое) категории
router.delete("/", categorySchema, validateRequestSchema,
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

      return res.status(400).send({ error: "Unable to delete entry" });
    }

  });

export { router as categoryRoute }