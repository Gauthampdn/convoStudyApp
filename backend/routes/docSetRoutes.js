const express = require("express");
const router = express.Router();

const { 
  deleteDocSet,
  getAllDocSets,
  updateDocumentSet,
  uploadPDF
} = require("../controllers/docSetController");

const upload = require('../middleware/uploadMiddleware'); 

const { protect } = require("../middleware/authMiddleware");

// Protect all routes below
router.use(protect);

router.delete("/:id", deleteDocSet);
router.get('/', getAllDocSets);
router.patch("/:id", updateDocumentSet);
router.post('/file/upload', upload.single('file'), uploadPDF);


module.exports = router;
