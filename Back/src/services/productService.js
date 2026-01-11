const productRepository = require('../repositories/productRepository');

class ProductService {
    async getAllProducts(page, limit, nombre, categoria) {
        const offset = (page - 1) * limit;
        const result = await productRepository.findAll({
            offset: parseInt(offset),
            limit: parseInt(limit),
            nombre,
            categoria
        });

        return {
            totalItems: result.count,
            totalPages: Math.ceil(result.count / limit),
            currentPage: parseInt(page),
            products: result.rows
        };
    }

    async getProductById(id) {
        return await productRepository.findById(id);
    }

    async createProduct(data) {
        this.validateProductData(data);
        return await productRepository.create(data);
    }

    async updateProduct(id, data) {
        const product = await productRepository.findById(id);
        if (!product) return null;

        if (data.nombre !== undefined || data.precio !== undefined) {
            this.validateProductData({ ...product.toJSON(), ...data });
        }

        return await productRepository.update(product, data);
    }

    validateProductData(data) {
        if (!data.nombre || data.nombre.length < 3) {
            throw new Error('El nombre debe tener al menos 3 caracteres');
        }
        if (data.precio <= 0) {
            throw new Error('El precio debe ser mayor a 0');
        }
        if (data.id_categoria && !Number.isInteger(data.id_categoria)) {
            throw new Error('El id_categoria debe ser un número entero válido');
        }
    }

    async deleteProduct(id) {
        const product = await productRepository.findById(id);
        if (!product) return false;

        await productRepository.delete(product);
        return true;
    }
}

module.exports = new ProductService();
