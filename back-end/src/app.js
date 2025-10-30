const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');  // Cấu hình kết nối MongoDB
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger-output.json');
const path = require('path');
const fs = require('fs');

dotenv.config();
connectDB();  // Kết nối MongoDB

const app = express();

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads/products');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Middleware để phân tích body của yêu cầu
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Swagger UI - chỉ enable trong development
if (process.env.NODE_ENV !== 'production') {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: "E-commerce API Docs"
  }));
}

// Import các routes
const userRoutes = require('./routes/userRoutes');
const storeRoutes = require('./routes/storeRoutes');
const productRoutes = require('./routes/productRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
// const couponRoutes = require('./routes/couponRoutes');
// const reviewRoutes = require('./routes/reviewRoutes');
// const orderRoutes = require('./routes/orderRoutes');
const authRoutes = require('./routes/authRoutes');

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to API',
    documentation: '/api-docs'
  });
});

// Sử dụng các routes
app.use('/api/users', userRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/products', productRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/auth', authRoutes);
// app.use('/api/coupons', couponRoutes);
// app.use('/api/reviews', reviewRoutes);
// app.use('/api/orders', orderRoutes);

// Export app để sử dụng trong bin/www
module.exports = app;
