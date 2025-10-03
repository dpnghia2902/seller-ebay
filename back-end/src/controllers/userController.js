const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// Tạo người dùng mới
const createUser = async (req, res) => {
  try {
    const { email, password_hash, role, name } = req.body;
    const newUser = new User({ email, password_hash, role, name });
    await newUser.save();
    res.status(201).json(newUser);  // Trả về người dùng mới tạo
  } catch (err) {
    res.status(400).json({ message: 'Error creating user', error: err.message });
  }
};

// Lấy tất cả người dùng
const getUsers = async (req, res) => {
  try {
    const users = await User.find();  // Truy vấn tất cả người dùng
    res.status(200).json(users);
  } catch (err) {
    res.status(400).json({ message: 'Error fetching users', error: err.message });
  }
};

// Lấy thông tin người dùng theo ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);  // Tìm người dùng theo ID
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ message: 'Error fetching user', error: err.message });
  }
};

// Cập nhật thông tin người dùng
const updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: 'Error updating user', error: err.message });
  }
};

// Xóa người dùng
const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(400).json({ message: 'Error deleting user', error: err.message });
  }
};

const getUserProfile = async (req, res) => {
  try {
    // req.user.id được lấy từ JWT token qua middleware authenticateJWT
    const userId = req.user.userId;
    console.log('userId:', userId);

    // Tìm user trong database, loại bỏ password_hash khỏi kết quả
    const user = await User.findById(userId).select('-password_hash');
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'Không tìm thấy user' 
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Lấy thông tin profile thành công',
      data: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        created_at: user.created_at,
        updated_at: user.updated_at
      }
    });
  } catch (error) {
    console.error('Error getting user profile:', error);
    res.status(500).json({ 
      success: false,
      message: 'Lỗi server khi lấy thông tin profile',
      error: error.message 
    });
  }
};

module.exports = { createUser, getUsers, getUserById, updateUser, deleteUser, getUserProfile };
