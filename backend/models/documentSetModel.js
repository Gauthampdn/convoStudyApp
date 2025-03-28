const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const documentSetSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    userId: {
      // relationship to "User" - One User to Many Documents
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // User should be unaware of documentSet but documentSet is aware of User (Look for Child's parent rather than look for parent's children)
      required: true,
    },
    files: [String],
    tags: [String], // tags for filtering ['math', 'science', etc]
    description: String, // description of document
    stats: {
      // study stats for each study session (can be edited as needed)
      sessions: [
        {
          sessionDate: {
            type: Date,
            default: Date.now,
          },
          totalQuestions: {
            type: Number,
            default: 0,
          },
          correct: {
            type: Number,
            default: 0,
          },
          somewhatCorrect: {
            type: Number,
            default: 0,
          },
          incorrect: {
            type: Number,
            default: 0,
          },
          accuracy: {
            // accuracy for current session
            type: Number,
            default: 0,
          },
          timeSpent: {
            // time spent (in sec?)
            type: Number,
            default: 0,
          },
        },
      ],
    },
  },
  { timestamps: true } // adds createdAt and updatedAt
);

module.exports = mongoose.model("documentSet", documentSetSchema);
