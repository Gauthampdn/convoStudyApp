const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["Student", "admin"], default: "Student" },

  //Related to Study Feilds
  studyStats: { type: Object, default: {} },
  totalStudyTime: { type: Number, default: 0 },
  uploadedNotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Note" }],
  flashcards: [{ type: mongoose.Schema.Types.ObjectId, ref: "Flashcard" }],

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
  ],

  createdAt: { type: Date, dafualt: Date.now },
});

module.exports = mongoose.model("User", UserSchema);
