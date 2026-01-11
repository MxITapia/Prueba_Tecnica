const productService = require('../services/productService');

// GET /api/productos
exports.getAllProducts = async (req, res) => {
    try {
        const { page = 1, limit = 10, nombre, categoria } = req.query;
        const result = await productService.getAllProducts(page, limit, nombre, categoria);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener productos', error: error.message });
    }
};

// GET /api/productos/:id
exports.getProductById = async (req, res) => {
    try {
        const product = await productService.getProductById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el producto', error: error.message });
    }
};

// POST /api/productos
exports.createProduct = async (req, res) => {
    try {
        const newProduct = await productService.createProduct(req.body);
        res.status(201).json(newProduct);
    } catch (error) {
        if (error.name === 'SequelizeValidationError' || error.message.includes('El nombre') || error.message.includes('El precio')) {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'Error al crear producto', error: error.message });
    }
};

// PUT /api/productos/:id
exports.updateProduct = async (req, res) => {
    try {
        const updatedProduct = await productService.updateProduct(req.params.id, req.body);
        if (!updatedProduct) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        res.json(updatedProduct);
    } catch (error) {
        if (error.name === 'SequelizeValidationError' || error.message.includes('El nombre') || error.message.includes('El precio')) {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'Error al procesar la solicitud', error: error.message });
    }
};

// DELETE /api/productos/:id
exports.deleteProduct = async (req, res) => {
    try {
        const success = await productService.deleteProduct(req.params.id);
        if (!success) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        res.json({ message: 'Producto eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar producto', error: error.message });
    }
};
