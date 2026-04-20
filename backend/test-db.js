import mysql from 'mysql2/promise';
import { config } from './config/environment.js';

async function testConnection() {
  try {
    console.log('🔌 Testing database connection...');
    const connection = await mysql.createConnection({
      host: config.db.host,
      port: config.db.port,
      user: config.db.user,
      password: config.db.password
    });
    
    console.log('✅ Connected to MySQL server');
    
    const [rows] = await connection.query(`SHOW DATABASES LIKE '${config.db.name}'`);
    if (rows.length === 0) {
      console.log(`📦 Database "${config.db.name}" not found. Run: node create-db.js`);
    } else {
      console.log(`✅ Database "${config.db.name}" exists`);
      
      // Check if tables exist
      await connection.query(`USE ${config.db.name}`);
      const [tables] = await connection.query(`SHOW TABLES`);
      const tableCount = tables.length;
      console.log(`📊 Tables found: ${tableCount}`);
      
      if (tableCount >= 8) {
        console.log('✅ All expected tables exist');
        
        // Check seeded data
        const [users] = await connection.query(`SELECT COUNT(*) as count FROM users`);
        const [zones] = await connection.query(`SELECT COUNT(*) as count FROM zones`);
        const [programs] = await connection.query(`SELECT COUNT(*) as count FROM programs`);
        
        console.log(`   👥 Users: ${users[0].count}`);
        console.log(`   🗺️  Zones: ${zones[0].count}`);
        console.log(`   📚 Programs: ${programs[0].count}`);
      } else {
        console.log('⚠️  Some tables missing. Run: npx sequelize-cli db:migrate');
      }
    }
    
    await connection.end();
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.log('\n💡 Troubleshooting:');
    console.log('   1. Ensure MySQL is running (XAMPP → Start MySQL)');
    console.log('   2. Check credentials in backend/.env');
    console.log('   3. Verify port 3306 is not blocked');
    process.exit(1);
  }
}

testConnection();
