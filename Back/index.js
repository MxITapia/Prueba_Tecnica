const app = require('./src/app');
const { connectDB, sequelize } = require('./src/config/database');
require('./src/models'); // Load associations
require('dotenv').config();

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    await connectDB();

    // Sync models (alter: true to update schema)
    await sequelize.sync({ alter: true });
    console.log('Database synced.');

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
};

startServer();
