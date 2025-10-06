const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');  // Cấu hình kết nối MongoDB
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger-output.json');

dotenv.config();
connectDB();  // Kết nối MongoDB

const app = express();

// Middleware để phân tích body của yêu cầu
app.use(express.json());

// Swagger UI - chỉ enable trong development
if (process.env.NODE_ENV !== 'production') {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: "E-commerce API Docs"
  }));
}

// Import các routes
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const storeRoutes = require('./routes/storeRoutes');
const couponRoutes = require('./routes/couponRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const orderRoutes = require('./routes/orderRoutes');
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
app.use('/api/products', productRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/auth', authRoutes);

// Export app để sử dụng trong bin/www
module.exports = app;
