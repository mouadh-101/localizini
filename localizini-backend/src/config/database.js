require('dotenv').config({ path: process.cwd() + '/.env' }); // Ensure .env from backend root is loaded

module.exports = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    dialect: 'postgres',
    dialectOptions: {
      // ssl: { require: true, rejectUnauthorized: false } // Example for SSL if needed
    },
    logging: console.log, // Shows SQL queries in console
  },
  // test: { ... }, // Optional: for testing environment
  // production: { ... } // Optional: for production environment
};
