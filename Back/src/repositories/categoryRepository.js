const Category = require('../models/category');

class CategoryRepository {
    async findAll() {
        return await Category.findAll();
    }

    async create(data) {
        return await Category.create(data);
    }

    async findById(id) {
        return await Category.findByPk(id);
    }
}

module.exports = new CategoryRepository();
