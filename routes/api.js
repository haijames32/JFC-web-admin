const express = require('express');
const router = express.Router();
const { userCtrl, prodCtrl, cartCtrl } = require('../controllers/api/index')

const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

// Login & Register
router.post('/user/login', userCtrl.login)
router.post('/user/register', userCtrl.register)

// Profile
router.get('/user/:id', userCtrl.getProfile)
router.put('/user/:id', userCtrl.editProfile)
router.patch('/user/changePassword/:id', userCtrl.changePassword)

// Product
router.get('/category', prodCtrl.listCategory)
router.get('/category/:id', prodCtrl.listProdByCategory)
router.get('/product/:id', prodCtrl.productDetails)

// Cart
router.get('/user/cart/:id', cartCtrl.getCartByUser)


module.exports = router