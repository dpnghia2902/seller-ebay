const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// Tạo người dùng mới
const createUser = async (req, res) => {
  try {
    const { email, password, role, name } = req.body;

    // Kiểm tra email đã tồn tại
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Validate role
    if (!['buyer', 'seller', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role specified' });
    }

    // Validate required fields
    if (!email || !password || !name) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Hash mật khẩu trước khi lưu
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Tạo người dùng mới
    const newUser = new User({
      email,
      password_hash,
      role,
      name
    });

    await newUser.save();

    // Tạo JWT token
    const token = jwt.sign(
      { userId: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Trả về thông tin người dùng (không bao gồm password_hash) và token
    const userResponse = {
      _id: newUser._id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
      created_at: newUser.created_at
    };

    res.status(201).json({
      message: 'User created successfully',
      user: userResponse,
      token
    });
  } catch (err) {
    console.error('Error in createUser:', err);
    res.status(500).json({ message: 'Error creating user', error: err.message });
  }
};

// Lấy tất cả người dùng (chỉ admin mới có quyền)
const getUsers = async (req, res) => {
  try {
    // Kiểm tra quyền admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    // Thêm phân trang và sắp xếp
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sort = req.query.sort || '-created_at';
    const search = req.query.search || '';

    const query = search 
      ? { 
          $or: [
            { email: { $regex: search, $options: 'i' } },
            { name: { $regex: search, $options: 'i' } }
          ]
        }
      : {};

    const users = await User
      .find(query)
      .select('-password_hash')
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await User.countDocuments(query);

    res.status(200).json({
      users,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalUsers: total,
        hasMore: page * limit < total
      }
    });
  } catch (err) {
    console.error('Error in getUsers:', err);
    res.status(500).json({ message: 'Error fetching users', error: err.message });
  }
};

// Lấy thông tin người dùng theo ID
const getUserById = async (req, res) => {
  try {
    // Kiểm tra quyền: admin có thể xem tất cả, user chỉ có thể xem thông tin của mình
    if (req.user.role !== 'admin' && req.user.userId !== req.params.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const user = await User
      .findById(req.params.id)
      .select('-password_hash')
      .populate('addresses');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error('Error in getUserById:', err);
    res.status(500).json({ message: 'Error fetching user', error: err.message });
  }
};

// Cập nhật thông tin người dùng
const updateUser = async (req, res) => {
  try {
    // Kiểm tra quyền: admin có thể cập nhật tất cả, user chỉ có thể cập nhật thông tin của mình
    if (req.user.role !== 'admin' && req.user.userId !== req.params.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { password, email, role, ...updateData } = req.body;

    // Chỉ admin mới có thể thay đổi role
    if (role && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admin can change user roles' });
    }

    // Nếu có cập nhật email, kiểm tra email đã tồn tại
    if (email) {
      const existingUser = await User.findOne({ email, _id: { $ne: req.params.id } });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already exists' });
      }
      updateData.email = email;
    }

    // Nếu có cập nhật mật khẩu
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password_hash = await bcrypt.hash(password, salt);
    }

    // Nếu admin thay đổi role
    if (req.user.role === 'admin' && role) {
      updateData.role = role;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        ...updateData,
        updated_at: Date.now()
      },
      { new: true }
    ).select('-password_hash');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'User updated successfully',
      user: updatedUser
    });
  } catch (err) {
    console.error('Error in updateUser:', err);
    res.status(500).json({ message: 'Error updating user', error: err.message });
  }
};

// Xóa người dùng (chỉ admin)
const deleteUser = async (req, res) => {
  try {
    // Kiểm tra quyền admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    // Không cho phép admin tự xóa chính mình
    if (req.user.userId === req.params.id) {
      return res.status(400).json({ message: 'Cannot delete your own admin account' });
    }

    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Xóa các dữ liệu liên quan (addresses, etc.)
    await Promise.all([
      // Xóa địa chỉ của user
      mongoose.model('Address').deleteMany({ _id: { $in: deletedUser.addresses } })
      // Có thể thêm xóa các dữ liệu khác liên quan đến user ở đây
    ]);

    res.status(200).json({ 
      message: 'User and related data deleted successfully',
      deletedUser: {
        id: deletedUser._id,
        email: deletedUser.email,
        name: deletedUser.name
      }
    });
  } catch (err) {
    console.error('Error in deleteUser:', err);
    res.status(500).json({ message: 'Error deleting user', error: err.message });
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
