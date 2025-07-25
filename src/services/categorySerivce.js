import { Category } from '../models/index.js';

export class CategoryService {

  static async getCategory(id) {
    try {
      let categoryToSend;

      if (id === undefined) {
        categoryToSend = await Category.findAll()
      } else {
        categoryToSend = await Category.findByPk(id);
      }

      return { error: null, data: categoryToSend }
    }
    catch (err) {
      console.error(err);

      return { error: err, data: null }
    }
  }

  static async createCategory(name) {
    try {

      const newCategory = await Category.create({ name });

      return { error: null, data: newCategory }
    }
    catch (err) {
      console.error(err);

      return { error: err, data: null }
    }
  }

  static async getCategoryByName(name) {
    try {

      const categoryByName = await Category.findOne({ where: { name: name } });

      return { error: null, data: categoryByName }
    }
    catch (err) {
      console.error(err);

      return { error: err, data: null }
    }

  }

  static async updateCategory(name, newName) {
    try {

      const categoryToUpdate = await Category.findOne({ where: { name: name } });
      
      if(categoryToUpdate === null){
        throw new Error('Category does not exsists');
      }

      await categoryToUpdate.update({ name: newName });

      return { error: null, data: categoryToUpdate }
    }
    catch (err) {
      console.error(err);

      return { error: err, data: null }
    }
  }

  static async deleteCategory(name) {
    try {

      const categoryToDelete = await Category.findOne({ where: { name: name } });
      
      if(categoryToDelete === null){
        throw new Error('Category does not exsists');
      }

      await Category.destroy({ where: { name: name } });

      return { error: null, data: categoryToDelete }
    }
    catch (err) {
      console.error(err);

      return { error: err, data: null }
    }
  }

}