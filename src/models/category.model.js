import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database.js';

export class Category extends Model { }

Category.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
    },
    {
        sequelize,
        modelName: 'categories',
        paranoid: true,
    },
);