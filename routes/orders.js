const express = require('express');
const router = express.Router();
const orderCtrl = require('../controllers/orderController')



router.get('/', orderCtrl.getListOrder)


module.exports = router