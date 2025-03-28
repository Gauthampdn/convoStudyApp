const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

// Generate access token (short-lived)
const generateAccessToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '15m' // 15 minutes
  });
};

// Generate refresh token (long-lived)
const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.REFRESH_TOKEN_SECRET || process.env.JWT_SECRET, {
    expiresIn: '30d' // 30 days - extended a bit for mobile
  });
};

// Google Sign In
exports.googleSignIn = async (req, res) => {
  try {
    const { email, googleId, picture, name } = req.body;
    
    // Find or create user
    let user = await User.findOne({ email });
    if (!user) {
      // Create new user
      user = await User.create({ 
        email, 
        googleId, 
        picture, 
        name
      });
    } else {
      // Update existing user info
      user.picture = picture || user.picture;
      user.name = name || user.name;
      user.googleId = googleId;
      await user.save();
    }
    
    // Generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    
    // Store refresh token in database
    user.refreshToken = refreshToken;
    await user.save();
    
    res.status(200).json({
      success: true,
      accessToken,
      refreshToken,
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        picture: user.picture
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Get current user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Refresh token endpoint with token rotation
exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token required'
      });
    }
    
    // Verify the refresh token
    const decoded = jwt.verify(
      refreshToken, 
      process.env.REFRESH_TOKEN_SECRET || process.env.JWT_SECRET
    );
    
    // Find user with this refresh token
    const user = await User.findOne({ 
      _id: decoded.id,
      refreshToken 
    });
    
    if (!user) {
      return res.status(403).json({
        success: false,
        message: 'Invalid refresh token'
      });
    }
    
    // Generate new tokens (token rotation)
    const accessToken = generateAccessToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);
    
    // Update refresh token in database
    user.refreshToken = newRefreshToken;
    await user.save();
    
    res.status(200).json({
      success: true,
      accessToken,
      refreshToken: newRefreshToken
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    // Check for token expiration error
    if (error.name === 'TokenExpiredError') {
      return res.status(403).json({
        success: false,
        message: 'Refresh token expired',
        expired: true
      });
    }
    
    return res.status(403).json({
      success: false,
      message: 'Invalid refresh token'
    });
  }
};

// Logout user
exports.logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token required'
      });
    }
    
    // Find user with this refresh token and clear it
    const user = await User.findOneAndUpdate(
      { refreshToken },
      { refreshToken: null },
      { new: true }
    );
    
    if (!user) {
      return res.status(200).json({
        success: true,
        message: 'Logged out'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
}; 