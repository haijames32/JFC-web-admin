const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/userController')


router.get('/', userCtrl.getListUser)
router.get('/:id', userCtrl.getDetailsUser)

module.exports = router;
