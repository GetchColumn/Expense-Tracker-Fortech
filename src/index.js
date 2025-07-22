import express from 'express';
import { body, param, query, validationResult } from 'express-validator';

import { sequelize } from './config/database.js'
import { Category } from './models/category.model.js';
import { Expense } from './models/expense.model.js';

const PORT = 8080;

const app = express();
app.use(express.json());

// получение всех расходов
app.get('/api/expense', async (req, res) => {
    try {
        const result = await Expense.findAll();

        return res.status(200).send(result);

    } catch (error) {
        console.error(error);
        return res.status(503).send({ error: "Database temporarily unavailable" });
    }
});



// добавление расходов
app.post('/api/expense', body('sum', 'category', 'description').notEmpty(),
    async (req, res) => {
        const valid = validationResult(req);

        if (valid.isEmpty()) {
            const { sum: sum, category, description } = req.body;
            let categoryObject = null;

            try {

                categoryObject = await Category.findOne({ where: { name: category } });

                if (categoryObject === null) {
                    return res.status(400).send({ message: "The specified category don't exist" });
                }

                const categoryId = categoryObject.id;
                const newExpense = await Expense.create({ sum, categoryId, description });

                return res.send(newExpense);

            } catch (error) {
                console.error(error);

                if (error.name === 'SequelizeConnectionError' || error.code === 'ECONNREFUSED') {
                    return res.status(503).send({ error: 'Database temporarily unavailable' });
                }

                return res.status(500).send({ error: "Unexpected error" });
            }
        }

        res.send({ errors: valid.array() });
    });



///////////////////////////////////////////////////////

// получение списка всех категорий
app.get('/api/category', async (req, res) => {
    try {

        const allCategories = await Category.findAll()

        res.send(allCategories);

    } catch (error) {
        console.error(error);
        return res.status(503).send({ error: "Database temporarily unavailable" });
    }
});

// получение категории по id
app.get('/api/category/:id', param('id').notEmpty().withMessage("Category id cannot be empty"),
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
app.post('/api/category', body('name').trim().notEmpty().withMessage("Category name cannot be empty")
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
app.put("/api/category", query('name').trim().notEmpty().withMessage("Category name cannot be empty")
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
app.delete("/api/category", body('name').trim().notEmpty().withMessage("Category name cannot be empty")
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


try {
    await sequelize.authenticate();
    await sequelize.sync({ force: true })
    app.listen(PORT, () =>
        console.log(`It's alive on http://localhost:${PORT}`),
    );
} catch (err) {
    console.log(err);
    process.exit(1);
}
