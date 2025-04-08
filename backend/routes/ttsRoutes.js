const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const { textToSpeech } = require("../controllers/ttsController");
router.use(protect);

router.post("/", textToSpeech);

module.exports = router;
