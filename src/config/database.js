import { createPool } from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

// Create connection pool for better performance
const pool = createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'notes_db',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Get promise-based connection
const promisePool = pool.promise();

// Test database connection
const testConnection = async () => {
  try {
    const connection = await promisePool.getConnection();
    console.log('✅ Database connected successfully');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
};

// Initialize database and create tables
const initDatabase = async () => {
  try {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS notes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `;
    
    await promisePool.query(createTableQuery);
    console.log('✅ Notes table created/verified successfully');
    
    // Insert sample data if table is empty
    const [rows] = await promisePool.query('SELECT COUNT(*) as count FROM notes');
    if (rows[0].count === 0) {
      const sampleNotes = [
        ['Meeting Notes', 'Discuss Q4 roadmap.'],
        ['Shopping List', 'Buy groceries: milk, eggs, bread.'],
        ['Project Ideas', 'Research new technologies for upcoming project.']
      ];
      
      for (const note of sampleNotes) {
        await promisePool.query(
          'INSERT INTO notes (title, content) VALUES (?, ?)',
          note
        );
      }
      console.log('✅ Sample notes inserted');
    }
    
    return true;
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    return false;
  }
};

// Export named exports for your noteModel.js
export { promisePool as pool, testConnection, initDatabase };

// Also keep default export if needed elsewhere
export default {
  pool: promisePool,
  testConnection,
  initDatabase
};
