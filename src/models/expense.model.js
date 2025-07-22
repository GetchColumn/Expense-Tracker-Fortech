import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database.js';

export class Expense extends Model { }

Expense.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        sum: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: false,
        },
        categoryId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            unique: false,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: false,
        }
    },
    {
        sequelize,
        modelName: 'expenses',
        paranoid: true,
    },
);