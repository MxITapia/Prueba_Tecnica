const User = require('../models/user');

class UserRepository {
    async findByUsername(username) {
        return await User.findOne({ where: { username } });
    }

    async create(userData) {
        return await User.create(userData);
    }
}

module.exports = new UserRepository();
