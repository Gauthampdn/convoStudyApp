const User = require('../models/testuserModel');
const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

exports.googleSignIn = async (req, res) => {
  try {
    const { email, id, picture, name } = req.body;
    
    // Find or create user
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ email, id, picture, name });
    } else {
      // Update existing user info if needed
      user.picture = picture;
      user.name = name;
      await user.save();
    }
    
    // Generate token
    const token = generateToken(user._id);
    
    res.status(200).json({
      success: true,
      token,
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
      error: 'Server error'
    });
  }
}; 