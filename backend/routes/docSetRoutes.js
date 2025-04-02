const express = require("express");
const router = express.Router();

const { updateDocumentSet } = require("../controllers/docSetController");

const requireAuth = require("../middleware/authMiddleware"); // auth middleware

router.use(requireAuth); // requires authentication and calls 'next'

router.patch("/:id", updateDocumentSet);

module.exports = router;
