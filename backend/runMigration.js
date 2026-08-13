/**
 * Standalone migration runner
 *
 * Executes database/schema.sql and creates the database,
 * tables, constraints, and default admin user.
 *
 * Usage:
 *   npm run migrate
 */

const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function runMigration() {

    // Project structure:
    //
    // roxiler-rating-platform/
    // ├── database/
    // │   └── schema.sql
    // └── backend/
    //     └── runMigration.js
    //
    // Therefore from backend/runMigration.js:
    // ../database/schema.sql

    const sqlPath = path.join(
        __dirname,
        '..',
        'database',
        'schema.sql'
    );

    console.log('Reading schema from:');
    console.log(sqlPath);

    if (!fs.existsSync(sqlPath)) {
        console.error('ERROR: schema.sql was not found.');
        console.error('Expected location:', sqlPath);
        process.exit(1);
    }

    const sql = fs.readFileSync(sqlPath, 'utf8');

    let conn;

    try {

        // Connect to MySQL without selecting a database.
        // This allows CREATE DATABASE in schema.sql to execute.
        conn = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            port: Number(process.env.DB_PORT) || 3306,
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            multipleStatements: true
        });

        console.log('Connected to MySQL successfully.');

        await conn.query(sql);

        console.log('Migration completed successfully.');
        console.log('Database and tables are ready.');

    } catch (err) {

        console.error('Migration failed.');
        console.error(err.message);

        process.exit(1);

    } finally {

        if (conn) {
            await conn.end();
        }
    }
}

runMigration();