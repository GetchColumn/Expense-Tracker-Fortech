import { CategoryService } from "../services/categorySerivce.js";

export class CategoryController {

  static async getAllCategory(req, res) {
    try {

      const { err, data: allCategories } = await CategoryService.getCategory();

      if (err) {
        throw new Error(err);
      }

      res.send({
        status: 200,
        error: null,
        data: allCategories
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

  static async getCategoryById(req, res) {
    try {
      const { id } = req.params;

      const { err, data: categoryById } = await CategoryService.getCategory(id);

      if (err) {
        throw new Error(err);
      }

      if (categoryById === null) {
        throw new Error("Category does not exsists")
      }

      res.send({
        status: 200,
        error: null,
        data: categoryById
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

  static async createCategory(req, res) {
    try {
      const { name } = req.body;

      const { err, data: newCategory } = await CategoryService.createCategory(name);

      if (err) {
        throw new Error(err);
      }

      if (newCategory === null) {
        throw new Error("Category cannot be created");
      }

      res.send({
        status: 200,
        error: null,
        data: newCategory
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

  static async updateFullCategory(req, res) {
    try {
      const { name } = req.query;
      const { newName } = req.body;

      const { err, data: updatedCategory } = await CategoryService.updateCategory(name, newName);

      if (err) {
        throw new Error(err);
      }

      res.send({
        status: 200,
        error: null,
        data: updatedCategory
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

  static async deleteCategory(req, res) {
    try {
      const { name } = req.query;

      const { err, data: categoryToDelete } = await CategoryService.deleteCategory(name);

      if (err) {
        throw new Error(err);
      }

      res.send({
        status: 200,
        error: null,
        data: categoryToDelete
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