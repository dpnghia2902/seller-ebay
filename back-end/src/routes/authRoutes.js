const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Route login
router.post('/login', authController.loginUser);

// Route logout
router.post('/logout', authController.logoutUser);

router.post('/register', authController.registerUser);

module.exports = router;
