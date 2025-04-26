const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { PDFEmbedding } = require("../controllers/embeddingController");

router.use(protect);

router.post("/embeddings/create", PDFEmbedding);
router.get("/docsets/:id/embeddings");

module.exports = router;
