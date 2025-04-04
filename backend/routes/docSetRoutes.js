const express = require('express');
const router = express.Router();
const {getAllDocSets} = require('../controllers/docSetController');
const { protect } = require('../middleware/authMiddleware');

// GET route to get all document sets
router.get('/', protect, getAllDocSets);

module.exports = router; 