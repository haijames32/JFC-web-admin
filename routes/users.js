var express = require('express');
var router = express.Router();
const userCtrl = require('../controllers/userController')

/* GET users listing. */
router.get('/', userCtrl.getListUser);

module.exports = router;
