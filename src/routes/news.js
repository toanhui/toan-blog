const express = require('express');
const router = express.Router();

const NewsController = require('../app/controllers/NewsController');
 


router.use('/news',NewsController.index);

module.exports = router;
