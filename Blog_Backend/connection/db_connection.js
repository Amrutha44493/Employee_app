const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected');
  } catch (err) {
    console.log('❌ MongoDB Connection Failed:', err.message);
    process.exit(1); // optional: stop server if DB fails
  }
};

module.exports = connectDB;
