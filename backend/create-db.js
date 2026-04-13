import mysql from 'mysql2/promise';
import { config } from './config/environment.js';

async function createDatabase() {
  try {
    const connection = await mysql.createConnection({
      host: config.db.host,
      port: config.db.port,
      user: config.db.user,
      password: config.db.password
    });
    
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${config.db.name}`);
    console.log(`Database ${config.db.name} created successfully`);
    
    await connection.end();
  } catch (error) {
    console.error('Error creating database:', error.message);
    process.exit(1);
  }
}

createDatabase();
