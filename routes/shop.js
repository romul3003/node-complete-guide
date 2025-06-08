const path = require('path');

const express = require('express');

const rootDir = require('../util/path'); 

const router = express.Router();

router.get('/', (req, res, next) => {
  // Serve the shop.html file when the root route is accessed
  res.sendFile(path.join(rootDir, 'views', 'shop.html'));
});


module.exports = router;