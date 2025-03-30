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
  name: {
    type: String,
    required: true,
    trim: true
  },
  picture: {
    type: String,
    default: 'https://ui-avatars.com/api/?name=User&background=random'
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true
  },
  refreshToken: {
    type: String,
    default: null
  },
  totalStudyTime: {
    type: Number,
    default: 0
  },
  studyStats: {
    type: Object,
    default: {}
  },
  filesUploaded: {
    type: [String],
    default: []
  },
  studySessions: [
    {
      documentSet: { type: mongoose.Schema.Types.ObjectId, ref: "DocumentSet" }, //Not sure if we need this. Delete this if you think we don't need this.
      flashcardPerformance: [
        {
          flashcard: { type: mongoose.Schema.Types.ObjectId, ref: "Flashcard" },
          rating: { type: String, enum: ["good", "somewhat", "incorrect"] },
        },
      ],
      sessionTime: { type: Number, default: 0 },
      createdAt: { type: Date, dafault: Date.now },
    },
  ]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema); 