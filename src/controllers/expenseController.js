import { ExpenseService } from "../services/expenseService.js";

export class ExpenseController {

  static async getAllExpense(req, res) {
    try {

      const { err, data: allExpense } = await ExpenseService.get();

      if (err) {
        throw new Error(err);
      }

      res.send({
        status: 200,
        error: null,
        data: allExpense
      });

    } catch (error) {
      console.error(error);
      return res.status(400).send({

        status: 400,
        error: error.message,
        data: null

      });
    }
  }

  static async getExpenseByCategory(req, res) {
    try {

      const { categoryName } = req.body;

      const { err, data: expenseByCategory } = await ExpenseService.getByCategory(categoryName);

      if (err) {
        throw new Error(err);
      }

      res.send({
        status: 200,
        error: null,
        data: expenseByCategory
      });

    } catch (error) {
      console.error(error);
      return res.status(400).send({

        status: 400,
        error: error.message,
        data: null

      });
    }
  }

  static async getExpenseByPeriod(req, res) {
    try {

      const { startDate, endDate } = req.query;

      const { err, data: expenseByPeriod } = await ExpenseService.getByPeriod(startDate, endDate);

      if (err) {
        throw new Error(err);
      }

      res.send({
        status: 200,
        error: null,
        data: expenseByPeriod
      });

    } catch (error) {
      console.error(error);
      return res.status(400).send({

        status: 400,
        error: error.message,
        data: null

      });
    }
  }

  static async addExpense(req, res) {
    try {
      const { sum, categoryName, description } = req.body;

      const { err, data: newExpense } = await ExpenseService.create(sum, categoryName, description);

      if (err) {
        throw new Error(err);
      }

      if (newExpense === null) {
        throw new Error("Expense cannot be created");
      }

      res.send({
        status: 200,
        error: null,
        data: newExpense
      });

    } catch (error) {
      console.error(error);
      return res.status(400).send({

        status: 400,
        error: error.message,
        data: null

      });
    }
  }

  static async deleteExpense(req, res) {
    try {
      const { id } = req.query;

      const { err, data: ExpenseToDelete } = await ExpenseService.delete(id);

      if (err) {
        throw new Error(err);
      }

      res.send({
        status: 200,
        error: null,
        data: ExpenseToDelete
      });

    } catch (error) {
      console.error(error);
      return res.status(400).send({

        status: 400,
        error: error.message,
        data: null

      });
    }
  }

}