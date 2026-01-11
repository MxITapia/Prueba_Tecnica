const userRepository = require('../repositories/userRepository');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class AuthService {
    async register(username, password) {
        const existingUser = await userRepository.findByUsername(username);
        if (existingUser) {
            throw new Error('El usuario ya existe');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        return await userRepository.create({ username, password: hashedPassword });
    }

    async login(username, password) {
        const user = await userRepository.findByUsername(username);
        if (!user) {
            throw new Error('Credenciales inválidas');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error('Credenciales inválidas');
        }

        const token = jwt.sign(
            { id: user.id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        return { token, user: { id: user.id, username: user.username } };
    }
}

module.exports = new AuthService();
