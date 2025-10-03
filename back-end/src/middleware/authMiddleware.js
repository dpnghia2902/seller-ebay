const jwt = require('jsonwebtoken');  // Cài đặt jsonwebtoken để xử lý JWT

// Middleware kiểm tra tính hợp lệ của Access Token
const authenticateJWT = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');  // Lấy token từ header Authorization

  if (!token) {
    return res.status(403).json({ message: 'Access denied, no token provided' });  // Nếu không có token
  }

  // Kiểm tra tính hợp lệ của token
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });  // Nếu token không hợp lệ
    }
    // debug
    console.log('Decoded JWT:', decoded);
    req.user = decoded;  // Gán thông tin người dùng vào request
    next();  // Tiếp tục xử lý yêu cầu
  });
};

module.exports = authenticateJWT;
