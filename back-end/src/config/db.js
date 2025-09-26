const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Đọc các biến môi trường từ tệp .env
dotenv.config();

// Hàm kết nối cơ sở dữ liệu MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('MongoDB connected...');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err.message);
    process.exit(1); // Dừng ứng dụng nếu kết nối thất bại
  }
};

module.exports = connectDB;
