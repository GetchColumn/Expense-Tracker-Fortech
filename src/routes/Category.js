import express from 'express';
import { body, param, query, validationResult } from 'express-validator';

import { Category } from '../models/category.model.js';

const router = express.Router();

// получение списка всех категорий
router.get('/category', async (req, res) => {
  try {

    const allCategories = await Category.findAll()

    res.send(allCategories);

  } catch (error) {
    console.error(error);
    return res.status(503).send({ error: "Database temporarily unavailable" });
  }
});

// получение категории по id
router.get('/category/:id', param('id').notEmpty().withMessage("Category id cannot be empty"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const result = await Category.findByPk(id);

      if (result === null) {
        return res.status(404).send({ message: "Not found" });
      }

      res.send(result);

    } catch (error) {
      console.error(error);
      return res.status(503).send({ error: "Database temporarily unavailable" });
    }
  });

// добавление новой категории
router.post('/category', body('name').trim().notEmpty().withMessage("Category name cannot be empty")
  .isAlpha().withMessage("Name must be alphabet letters."),
  async (req, res) => {
    const valid = validationResult(req);

    if (valid.isEmpty()) {
      const { name } = req.body;

      try {
        const result = await Category.create({ name });
        console.log(result);
        return res.send(result);
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
    }
    res.status(400).send({ errors: valid.array() });
  });

// полное обновление категории
router.put("/category", query('name').trim().notEmpty().withMessage("Category name cannot be empty")
  .isAlpha().withMessage("Name must be alphabet letters."), body('newName').trim()
    .notEmpty().withMessage("New category name cannot be empty")
    .isAlpha().withMessage("New name must be alphabet letters."),
  async (req, res) => {
    const valid = validationResult(req);

    if (valid.isEmpty()) {
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
    }
    res.status(400).send({ errors: valid.array() });
  });


// удаление (мягкое) категории
router.delete("/category", body('name').trim().notEmpty().withMessage("Category name cannot be empty")
  .isAlpha().withMessage("Name must be alphabet letters."),
  async (req, res) => {
    const valid = validationResult(req);

    if (valid.isEmpty) {
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
    }

    res.status(200).send({});
  });

export { router as categoryRoute }