const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'E-commerce API Documentation',
    version: '1.0.0',
    description: 'API documentation cho hệ thống E-commerce',
    contact: {
      name: 'API Support',
      email: 'support@example.com'
    }
  },
  host: 'localhost:3000',
  basePath: '/',
  schemes: ['http', 'https'],
  consumes: ['application/json'],
  produces: ['application/json'],
  tags: [
    {
      name: 'Users',
      description: 'Endpoints quản lý người dùng'
    },
    {
      name: 'Products',
      description: 'Endpoints quản lý sản phẩm'
    },
    {
      name: 'Orders',
      description: 'Endpoints quản lý đơn hàng'
    }
  ],
  securityDefinitions: {
    bearerAuth: {
      type: 'apiKey',
      name: 'Authorization',
      in: 'header',
      description: 'Nhập JWT token với format: Bearer {token}'
    }
  },
  definitions: {
    User: {
      id: '507f1f77bcf86cd799439011',
      email: 'user@example.com',
      name: 'Nguyen Van A',
      role: 'buyer',
      created_at: '2024-01-01T00:00:00.000Z',
      updated_at: '2024-01-01T00:00:00.000Z'
    },
    CreateUserRequest: {
      email: 'user@example.com',
      password: 'password123',
      name: 'Nguyen Van A',
      role: 'buyer'
    },
    UpdateUserRequest: {
      name: 'Nguyen Van B',
      email: 'newuser@example.com'
    },
    Product: {
      id: '507f1f77bcf86cd799439012',
      name: 'iPhone 15',
      description: 'Điện thoại iPhone 15',
      price: 25000000,
      stock: 100,
      category: 'Electronics',
      seller_id: '507f1f77bcf86cd799439011',
      created_at: '2024-01-01T00:00:00.000Z'
    },
    Order: {
      id: '507f1f77bcf86cd799439013',
      user_id: '507f1f77bcf86cd799439011',
      items: [
        {
          product_id: '507f1f77bcf86cd799439012',
          quantity: 2,
          price: 25000000
        }
      ],
      total_amount: 50000000,
      status: 'pending',
      created_at: '2024-01-01T00:00:00.000Z'
    },
    SuccessResponse: {
      success: true,
      message: 'Thao tác thành công',
      data: {}
    },
    ErrorResponse: {
      success: false,
      message: 'Có lỗi xảy ra',
      error: 'Chi tiết lỗi'
    }
  }
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./app.js']; // File chính khởi tạo routes

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  console.log('✅ Swagger documentation generated successfully!');
  console.log('📄 Output file: swagger-output.json');
});