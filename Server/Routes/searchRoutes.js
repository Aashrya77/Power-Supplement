const express = require('express');
const router = express.Router();
const searchController = require('../Controllers/searchController');

router.get('/suggestions', searchController.getSearchSuggestions);

module.exports = router;
