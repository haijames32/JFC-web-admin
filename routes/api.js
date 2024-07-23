const express = require('express');
const router = express.Router();
const {
   userCtrl,
   prodCtrl,
   cartCtrl,
   orderCtrl
} = require('../controllers/api/index')

const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

// User
router.post('/users/login', userCtrl.login)
router.post('/users/register', userCtrl.register)
router.get('/users/:id', userCtrl.getProfile)
router.put('/users/:id', userCtrl.editProfile)
router.patch('/users/changePassword/:id', userCtrl.changePassword)
router.get('/users/address/:id', userCtrl.getAddressByUser)
router.post('/users/address', userCtrl.postAddress)
router.patch('/users/setAddressDefault/:id', userCtrl.setAddressDefault)
router.delete('/users/address/delete/:id', userCtrl.deleteAddress)

// Product
router.get('/category', prodCtrl.listCategory)
router.get('/category/:id', prodCtrl.listProdByCategory)
router.get('/products/:id', prodCtrl.productDetails)

// Cart
router.get('/users/cart/:id', cartCtrl.getCartByUser)
router.delete('/users/cart/delete/:id', cartCtrl.deleteProductInCart)
router.post('/users/cart', cartCtrl.addProductToCart)
router.post('/users/cart/changeQuantity/:id', cartCtrl.changeQuantity)

// Order
router.get('/users/order/:id', orderCtrl.getOrderByUser)
router.get('/users/order/details/:id', orderCtrl.getOrderDetails)
router.post('/users/order', orderCtrl.postOrder)


module.exports = router