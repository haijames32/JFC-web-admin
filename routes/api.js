const express = require('express');
const router = express.Router();
const {
   userCtrl,
   prodCtrl,
   cartCtrl,
   orderCtrl,
   authCtrl
} = require('../controllers/api/index')

const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

// Auth
router.post('/user/login', authCtrl.login)
router.post('/user/register', authCtrl.register)
router.patch('/user/changePassword/:id', authCtrl.changePassword)

// User
router.get('/user/profile/:id', userCtrl.getProfile)
router.put('/user/editProfile/:id', userCtrl.editProfile)
router.get('/user/address/:id', userCtrl.getAddressByUser)
router.post('/user/address', userCtrl.postAddress)
router.patch('/user/setAddressDefault/:id', userCtrl.setAddressDefault)
router.delete('/user/deleteAddress/:id', userCtrl.deleteAddress)

// Product
router.get('/category', prodCtrl.listCategory)
router.get('/productByCategory/:id', prodCtrl.listProdByCategory)
router.get('/product/:id', prodCtrl.productDetails)

// Cart
router.get('/user/cart/:id', cartCtrl.getCartByUser)
router.delete('/user/cart/delete/:id', cartCtrl.deleteProductInCart)
router.post('/user/cart', cartCtrl.addProductToCart)
router.patch('/user/cart/changeQuantity/:id', cartCtrl.changeQuantity)

// Order
router.get('/user/order/:id', orderCtrl.getOrderByUser)
router.get('/user/order/details/:id', orderCtrl.getOrderDetails)
router.post('/user/order', orderCtrl.postOrder)
router.patch('/user/order/changeAddress/:id', orderCtrl.changeOrderAddress)
router.patch('/user/order/cancelOrder/:id', orderCtrl.cancelOrder)


module.exports = router