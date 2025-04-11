const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const sttController = require("../controllers/sttController");

router.use(protect);

router.post("/transcribe", sttController.transcribeFromUrl);

module.exports = router;
