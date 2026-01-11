const mysql = require('mysql2/promise');
require('dotenv').config();

const { DB_HOST, DB_USER, DB_PASS, DB_NAME, DB_PORT } = process.env;

async function createDatabase() {
    try {
        // Connect to MySQL server without specifying a database
        const connection = await mysql.createConnection({
            host: DB_HOST,
            user: DB_USER,
            password: DB_PASS,
            port: DB_PORT || 3306 // Default to 3306 if not in env
        });

        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`;`);
        console.log(`Database '${DB_NAME}' created or already exists.`);

        await connection.end();
    } catch (error) {
        console.error('Error creating database:', error);
        process.exit(1);
    }
}

createDatabase();
