const mongoose = require('mongoose');
const dotenv = require('dotenv');


dotenv.config();

 
const connectDatabase = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.log(' MONGO_URI not provided. Skipping database connection.');
      return;
    }

    console.log('Connecting to MongoDB...');
    
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB successfully');
    console.log(`Database: ${mongoose.connection.name}`);
    
  } catch (error) {
    console.error(' MongoDB connection error:', error.message);
    console.log('Server will continue running without database connection');
  }
};

module.exports = connectDatabase; 