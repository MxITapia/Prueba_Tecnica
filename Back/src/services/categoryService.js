const categoryRepository = require('../repositories/categoryRepository');

class CategoryService {
    async getAllCategories() {
        return await categoryRepository.findAll();
    }

    async createCategory(data) {
        if (!data.nombre) {
            throw new Error('El nombre de la categoría es requerido');
        }
        return await categoryRepository.create(data);
    }
}

module.exports = new CategoryService();
