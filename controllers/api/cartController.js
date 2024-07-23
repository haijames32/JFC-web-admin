const myModel = require('../../models/MyModel')

const getCartByUser = async (req, res, next) => {
   const listCart = await myModel.cartModel.find({ userId: req.params.id })
      .populate('productId')
      .populate('userId')
   res.status(200).json({ data: listCart })
}

const changeQuantity = async (req, res, next) => {
   try {
      const id = req.params.id
      const cart = await myModel.cartModel.findById({ _id: id })
      const body = req.body.quantity
      let newQuantity
      if (body) {
         switch (body) {
            case 'increase':
               cart.numOfProduct += 1
               break
            case 'decrease':
               cart.numOfProduct -= 1
               break
            default: null
         }
         newQuantity = await cart.save()
      }
      res.status(200).json({ data: newQuantity.numOfProduct })
   } catch (error) {
      console.log('Error: ', error)
      res.status(400).json({ message: 'Có lỗi xảy ra' })
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
      const createProduct = new myModel.cartModel({
         productId,
         userId,
         numOfProduct,
         total
      })
      const newProd = await createProduct.save()
      res.status(200).json({ data: newProd, message: 'Đã thêm vào giỏ hàng' })
   } catch (error) {
      console.log('Error: ', error)
      res.status(400).json({ message: 'Có lỗi xảy ra' })
   }
}

const deleteProductInCart = async (req, res) => {
   try {
      const cart = await myModel.cartModel.findByIdAndDelete({ _id: req.params.id })
      res.status(200).json({ data: cart })
   } catch (error) {
      console.log('Error: ', error)
      res.status(400).json({ message: 'Có lỗi xảy ra' })
   }
}

module.exports = {
   getCartByUser,
   changeQuantity,
   deleteProductInCart,
   addProductToCart,
}