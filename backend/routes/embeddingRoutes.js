const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  PDFEmbedding,
  getEmbeddingsFromDocSet,
} = require("../controllers/embeddingController");

// router.use(protect);

router.post("/create", PDFEmbedding);
router.get("/docsets/:id/", getEmbeddingsFromDocSet);

module.exports = router;
