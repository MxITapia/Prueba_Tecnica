const Product = require('../models/product');
const Category = require('../models/category');
const { Op } = require('sequelize');

class ProductRepository {
    async findAll({ offset, limit, nombre, categoria }) {
        const where = {};
        if (nombre) where.nombre = { [Op.like]: `%${nombre}%` };

        const include = [{
            model: Category,
            as: 'categoria',
            attributes: ['id', 'nombre'],
            where: categoria ? { nombre: { [Op.like]: `%${categoria}%` } } : undefined
        }];

        return await Product.findAndCountAll({
            where,
            include,
            limit,
            offset,
            order: [['creadoEn', 'DESC']]
        });
    }

    async findById(id) {
        return await Product.findByPk(id, {
            include: [{ model: Category, as: 'categoria', attributes: ['id', 'nombre'] }]
        });
    }

    async create(data) {
        return await Product.create(data);
    }

    async update(product, data) {
        return await product.update(data);
    }

    async delete(product) {
        return await product.destroy();
    }
}

module.exports = new ProductRepository();
