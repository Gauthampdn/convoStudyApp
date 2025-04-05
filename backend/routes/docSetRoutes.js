const express = require("express");
const router = express.Router();

const { deleteDocSet, getAllDocSets } = require("../controllers/docSetController");

const { protect } = require("../middleware/authMiddleware");

router.use(protect);

router.delete("/:id", deleteDocSet);

router.get('/', protect, getAllDocSets);


module.exports = router;
