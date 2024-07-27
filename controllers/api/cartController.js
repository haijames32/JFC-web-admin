const myModel = require('../../models/MyModel')

const getCartByUser = async (req, res) => {
   try {
      const listCart = await myModel.cartModel
         .find({ userId: req.params.id })
         .populate('productId')
         .populate('userId')
      return res.status(200).json({ data: listCart })
   } catch (error) {
      console.log('Error: ', error);
      return res.status(400).json({ message: 'Đã xảy ra lỗi' })
   }
}

const changeQuantity = async (req, res) => {
   try {
      let newQuantity
      const body = req.body.quantity
      const cart = await myModel.cartModel.findById({ _id: req.params.id })
      const product = await myModel.productModel.findById({ _id: cart.productId })
      switch (body) {
         case 'up':
            cart.numOfProduct += 1
            break
         case 'down':
            if (cart.numOfProduct == 1) {
               return res.status(200).json({ message: 'OK' })
            }
            cart.numOfProduct -= 1
            break
         default: null
      }
      cart.total = product.price * cart.numOfProduct
      newQuantity = await cart.save()
      return res.status(200).json({ data: newQuantity })
   } catch (error) {
      console.log('Error: ', error)
      return res.status(400).json({ message: 'Đã xảy ra lỗi' })
   }
}

const addProductToCart = async (req, res) => {
   try {
      const {
         productId,
         userId,
         numOfProduct
      } = req.body
      const product = await myModel.productModel.findById({ _id: productId })
      const total = product.price * numOfProduct
      const addProdInCart = new myModel.cartModel({
         productId,
         userId,
         numOfProduct,
         total
      })
      const newProd = await addProdInCart.save()
      return res.status(200).json({ data: newProd, message: 'Đã thêm vào giỏ hàng' })
   } catch (error) {
      console.log('Error: ', error)
      return res.status(400).json({ message: 'Đã xảy ra lỗi' })
   }
}

const deleteProductInCart = async (req, res) => {
   try {
      const cart = await myModel.cartModel.findByIdAndDelete({ _id: req.params.id })
      return res.status(200).json({ data: cart })
   } catch (error) {
      console.log('Error: ', error)
      return res.status(400).json({ message: 'Đã xảy ra lỗi' })
   }
}

module.exports = {
   getCartByUser,
   changeQuantity,
   deleteProductInCart,
   addProductToCart,
}