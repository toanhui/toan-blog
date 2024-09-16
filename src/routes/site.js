const express = require('express');
const router = express.Router();

const SiteController = require('../app/controllers/SiteController');
 


router.use('/',SiteController.index);
router.use('/login',SiteController.login);

module.exports = router;
