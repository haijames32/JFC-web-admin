const express = require('express');
const router = express.Router();
const orderCtrl = require('../controllers/orderController')



router.get('/', orderCtrl.getListOrder)
router.get('/:id', orderCtrl.getOrderDetails)
router.get('/finished', orderCtrl.getListFinished)
router.put('/:id/status', orderCtrl.putStatus)


module.exports = router