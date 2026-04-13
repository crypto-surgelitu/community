import { Sequelize } from 'sequelize';
import { config } from '../config/environment.js';

export const sequelize = new Sequelize(config.db.name, config.db.user, config.db.password, {
  host: config.db.host,
  port: config.db.port,
  dialect: 'mysql',
  logging: config.logLevel === 'debug' ? console.log : false,
  pool: {
    min: config.db.pool.min,
    max: config.db.pool.max,
    acquire: config.db.pool.acquire,
    idle: config.db.pool.idle
  },
  define: {
    timestamps: true,
    underscored: true
  }
});

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    throw error;
  }
};
