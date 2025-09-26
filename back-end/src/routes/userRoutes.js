const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Route để tạo người dùng mới (Create)
router.post('/', userController.createUser);

// Route để lấy tất cả người dùng (Read)
router.get('/', userController.getUsers);

// Route để lấy người dùng theo ID (Read)
router.get('/:id', userController.getUserById);

// Route để cập nhật thông tin người dùng (Update)
router.put('/:id', userController.updateUser);

// Route để xóa người dùng (Delete)
router.delete('/:id', userController.deleteUser);

module.exports = router;
