const authService = require('../services/authService');

exports.register = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: 'Usuario y contraseña requeridos' });
        }
        const user = await authService.register(username, password);
        res.status(201).json({ message: 'Usuario creado exitosamente', userId: user.id });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: 'Usuario y contraseña requeridos' });
        }
        const result = await authService.login(username, password);
        res.json(result);
    } catch (error) {
        res.status(401).json({ message: error.message });
    }
};
