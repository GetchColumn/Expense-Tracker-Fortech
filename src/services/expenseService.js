import { Category, Expense } from "../models/index.js";
import { Op } from 'sequelize';

export class ExpenseService {

  static async get(id) {
    try {
      let expenseToGet;

      if (id === undefined) {
        expenseToGet = await Expense.findAll()
      } else {
        expenseToGet = await Expense.findByPk(id);
      }

      return { error: null, data: expenseToGet }
    }
    catch (err) {
      console.error(err);

      return { error: err, data: null }
    }
  }

  static async getByCategory(categoryName) {
    try {

      if (categoryName === undefined) {
        throw new Error('Category is undefined');
      }

      const categoryToGet = await Category.findOne({ where: { name: categoryName } });

      if (categoryToGet === null) {
        throw new Error('Category does not exsists');
      }

      const categoryId = categoryToGet.id;

      const expenseToGet = await Expense.findAll({ where: { categoryId: categoryId } });

      return { error: null, data: expenseToGet }
    }
    catch (err) {
      console.error(err);

      return { error: err, data: null }
    }
  }

  //todo
  static async getByPeriod(startDate, endDate) {
    try {

      if (startDate === undefined || endDate === undefined) {
        throw new Error('Period is undefined');
      }

      const expenseToGet = await Expense.findAll({
        where: {
          //!
          createdAt: {
            [Op.between]: [startDate, endDate],
          }
        }
      });

      if (expenseToGet === null) {
        throw new Error('Expense does not exsists');
      }

      return { error: null, data: expenseToGet }
    }
    catch (err) {
      console.error(err);

      return { error: err, data: null }
    }
  }

  static async create(sum, categoryName, description) {
    try {

      const categoryForExpense = await Category.findOne({ where: { name: categoryName } });

      if (categoryForExpense === null) {
        throw new Error('Category does not exsists');
      }
      const categoryId = categoryForExpense.dataValues.id;

      const newExpense = await Expense.create({ sum, categoryId, description });

      return { error: null, data: newExpense }
    }
    catch (err) {
      console.error(err);

      return { error: err, data: null }
    }
  }


  static async delete(id) {
    try {

      const expenseToDelete = await Expense.findOne({ where: { id: id } });

      if (expenseToDelete === null) {
        throw new Error('Expense does not exsists');
      }

      await Expense.destroy({ where: { id: id } });

      return { error: null, data: expenseToDelete }
    }
    catch (err) {
      console.error(err);

      return { error: err, data: null }
    }
  }
}
