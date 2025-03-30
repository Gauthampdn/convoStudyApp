const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Google sign in
router.post('/google', authController.googleSignIn);

// Refresh token
router.post('/refresh', authController.refreshToken);

// Logout
router.post('/logout', authController.logout);

// Get user profile (protected route)
router.get('/profile', protect, authController.getProfile);

module.exports = router; 