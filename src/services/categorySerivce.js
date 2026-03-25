import { Category } from '../models/index.js';

export class CategoryService {

  static async get(id) {
    try {
      let categoryToGet;

      if (id === undefined) {
        categoryToGet = await Category.findAll()
      } else {
        categoryToGet = await Category.findByPk(id);
      }

      return { error: null, data: categoryToGet }
    }
    catch (err) {
      console.error(err);

      return { error: err, data: null }
    }
  }

  static async create(name) {
    try {

      const newCategory = await Category.create({ name });

      return { error: null, data: newCategory }
    }
    catch (err) {
      console.error(err);

      return { error: err, data: null }
    }
  }

  static async getByName(name) {
    try {

      const categoryByName = await Category.findOne({ where: { name: name } });

      return { error: null, data: categoryByName }
    }
    catch (err) {
      console.error(err);

      return { error: err, data: null }
    }

  }

  static async update(name, newName) {
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

  static async delete(name) {
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