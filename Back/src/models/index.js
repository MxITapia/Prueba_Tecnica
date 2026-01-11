const Product = require('./product');
const Category = require('./category');
const User = require('./user');

// Define associations
Category.hasMany(Product, { foreignKey: 'id_categoria', as: 'productos' });
Product.belongsTo(Category, { foreignKey: 'id_categoria', as: 'categoria' });

module.exports = { Product, Category, User };
