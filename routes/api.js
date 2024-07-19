const express = require('express');
const router = express.Router();
const { userCtrl, prodCtrl } = require('../controllers/api/index')

const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());


router.post('/user/login', userCtrl.login)
router.post('/user/register', userCtrl.register)

router.get('/user/:id', userCtrl.getProfile)
router.put('/user/:id', userCtrl.editProfile)
router.patch('/user/changePassword/:id', userCtrl.changePassword)

router.get('/category', prodCtrl.listCategory)
router.get('/category/:id', prodCtrl.listProdByCategory)
router.get('/product/:id', prodCtrl.productDetails)


module.exports = router