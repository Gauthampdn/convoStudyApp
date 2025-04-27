const express = require("express");
const router = express.Router();

const { 
  deleteDocSet,
  getAllDocSets,
  getDocumentSet,
  updateDocumentSet,
  uploadPDFs
} = require("../controllers/docSetController");

const upload = require('../middleware/uploadMiddleware'); 

const { protect } = require("../middleware/authMiddleware");

// Protect all routes below
router.use(protect);

router.delete("/:id", deleteDocSet);
router.get('/', getAllDocSets);
router.get('/:id', getDocumentSet);
router.patch("/:id", updateDocumentSet);
router.post('/upload/:id', upload.array('files'), uploadPDFs);


module.exports = router;
