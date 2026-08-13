const mysql = require('mysql2/promise');
require('dotenv').config();

/**
 * MySQL connection pool (promise-based).
 * Uses a pool so concurrent requests reuse connections efficiently.
 */
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'roxiler_rating_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4_unicode_ci',
});

module.exports = pool;
