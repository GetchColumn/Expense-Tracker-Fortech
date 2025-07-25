import { Category } from "./category.model.js";
import { Expense } from "./expense.model.js";

Category.hasMany(Expense);
Expense.belongsTo(Category);

export * from './category.model.js'
export * from './expense.model.js'