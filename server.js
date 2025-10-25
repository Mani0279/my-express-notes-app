import dotenv from 'dotenv';
import app from './src/app.js';  // ← Changed from './app.js'
import { testConnection, initDatabase } from './src/config/database.js';

dotenv.config();

const PORT = process.env.PORT || 3000;

// Initialize database and start server
const startServer = async () => {
  try {
    // Test database connection
    const isConnected = await testConnection();
    
    if (!isConnected) {
      console.error('❌ Failed to connect to database. Exiting...');
      process.exit(1);
    }
    
    // Initialize database tables and sample data
    await initDatabase();
    
    // Start Express server
    app.listen(PORT,'0.0.0.0', () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📝 API Base URL: http://localhost:${PORT}`);
      console.log(`🔍 Health Check: http://localhost:${PORT}/health`);
      console.log(`📋 Notes API: http://localhost:${PORT}/notes`);
    });
    
  } catch (error) {
    console.error('❌ Server startup failed:', error.message);
    process.exit(1);
  }
};

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('💥 Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
  console.error('💥 Unhandled Rejection:', error);
  process.exit(1);
});

// Start the server
startServer();
