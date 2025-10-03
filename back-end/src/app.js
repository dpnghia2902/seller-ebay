const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');  // Cấu hình kết nối MongoDB

dotenv.config();
connectDB();  // Kết nối MongoDB

const app = express();

// Middleware để phân tích body của yêu cầu
app.use(express.json());

// Import các routes
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const storeRoutes = require('./routes/storeRoutes');
const couponRoutes = require('./routes/couponRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const orderRoutes = require('./routes/orderRoutes');
const authRoutes = require('./routes/authRoutes');
// Sử dụng các routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/auth', authRoutes);

// Export app để sử dụng trong bin/www
module.exports = app;
