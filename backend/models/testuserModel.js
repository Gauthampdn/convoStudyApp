const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  id: {
    type: String,
    required: true,
    unique: true
  },
  picture: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  }
}, { timestamps: true });


module.exports = mongoose.model('User', userSchema);
