import app from './app.js';
import { connectDB, sequelize } from './config/database.js';
import { config } from './config/environment.js';
import { seed } from './database/seeders/001-seed-initial-data.js';

const startServer = async () => {
  try {
    await connectDB();
    
    if (config.env === 'development') {
      await sequelize.sync({ force: false });
      console.log('Database synchronized');
      
      await seed();
    }
    
    app.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`);
      console.log(`Environment: ${config.env}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
