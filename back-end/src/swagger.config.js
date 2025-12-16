const swaggerUiOptions = {
  explorer: true,
  swaggerOptions: {
    persistAuthorization: true, // Lưu token khi refresh
    docExpansion: 'none', // Collapse tất cả endpoints
    filter: true, // Bật search
    displayRequestDuration: true // Hiển thị thời gian request
  },
  customCss: `
    .swagger-ui .topbar { 
      background-color: #2c3e50; 
    }
    .swagger-ui .info .title {
      color: #2c3e50;
    }
  `,
  customSiteTitle: "E-commerce API Documentation",
};

module.exports = swaggerUiOptions;