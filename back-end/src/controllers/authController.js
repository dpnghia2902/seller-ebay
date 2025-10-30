const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');  // Mô hình người dùng trong MongoDB

// Tạo Access Token (JWT)
const createAccessToken = (user) => {
  return jwt.sign(    
    { 
      userId: user._id.toString(),  // ID để identify user
      email: user.email,             // Email để hiển thị/validate
      role: user.role                // Role để phân quyền (buyer/seller/admin)
    }, process.env.JWT_SECRET, { expiresIn: '1d' });  // Hết hạn trong 1 ngày
};

const registerUser = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Kiểm tra xem người dùng đã tồn tại trong cơ sở dữ liệu chưa
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Mã hóa mật khẩu trước khi lưu vào cơ sở dữ liệu
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Tạo và lưu người dùng mới
    const newUser = new User({
      email,
      password_hash: passwordHash,
      name,
      role: 'buyer'  // Mặc định vai trò là 'buyer'
    });

    await newUser.save();

    // Tạo Access Token cho người dùng mới
    const accessToken = createAccessToken(newUser);

    // Trả về thông tin người dùng và token
    res.status(201).json({
      message: 'User registered successfully',
      user: { email: newUser.email, name: newUser.name },
      accessToken
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Login (Tạo Access Token và gửi về client)
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Kiểm tra người dùng trong cơ sở dữ liệu
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });

    // Kiểm tra mật khẩu
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(400).json({ message: 'Invalid password' });

    // Tạo Access Token
    const accessToken = createAccessToken(user);

    // Trả về Access Token cho client
    res.json({ accessToken });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Logout (Xóa token ở phía client)
const logoutUser = (req, res) => {
  // Bạn chỉ cần thông báo cho client xóa token
  res.status(200).json({ message: 'Logout successful' });
};

module.exports = { registerUser , loginUser, logoutUser };
