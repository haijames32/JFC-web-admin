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
      res.status(400).json({ message: error })
   }
}

const deleteProductInCart = async (req, res) => {
   try {
      const cart = await myModel.cartModel.findByIdAndDelete({ _id: req.params.id })
      res.status(200).json({ data: cart })
   } catch (error) {
      console.log('Error: ', error)
      res.status(400).json({ message: error.message })
   }
}


module.exports = {
   getCartByUser,
   changeQuantity,
   deleteProductInCart,
}