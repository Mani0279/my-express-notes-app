import dotenv from 'dotenv';
dotenv.config();

import app from './src/app.js';
import { connectDatabase } from './src/config/database.js';

const PORT = process.env.PORT || 3000;

// Start server after connecting to MongoDB
const startServer = async () => {
  try {
    await connectDatabase(); // waits for MongoDB connection
    app.listen(PORT, '0.0.0.0', () => {
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

startServer();
