const express = require('express');
const router = express.Router();
const {uploadAttachment} = require('../controllers/uploadController.js');


// Upload image
router.post('/any', uploadAttachment);

// Upload pdf



module.exports = router;