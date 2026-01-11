const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Product = sequelize.define('Product', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [3, 50],
            notEmpty: true
        }
    },
    precio: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
            min: 0.01
        }
    },
    id_categoria: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'categorias', // 'categorias' refers to table name
            key: 'id',
        }
    }
}, {
    tableName: 'productos',
    timestamps: true,
    createdAt: 'creadoEn',
    updatedAt: false,
    paranoid: true,
});

module.exports = Product;
