const express = require('express');
const router = express.Router();
const orderCtrl = require('../controllers/orderController')



router.get('/', orderCtrl.getListOrder)
router.get('/finished', orderCtrl.getListFinished)
router.get('/:id', orderCtrl.getOrderDetails)
router.put('/:id/status', orderCtrl.putStatus)


module.exports = router