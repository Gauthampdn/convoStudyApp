const express = require("express");
const router = express.Router();

const { deleteDocSet } = require("../controllers/docSetController");

const { protect } = require("../middleware/authMiddleware");

router.use(protect);

router.delete("/:id", deleteDocSet);

module.exports = router;
