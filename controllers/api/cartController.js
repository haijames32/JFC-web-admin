const myModel = require('../../models/MyModel')

const getCartByUser = async (req, res, next) => {
   const listCart = await myModel.cartModel.find({ userId: req.params.id })
      .populate('productId')
      .populate('userId')
   res.status(200).json({ data: listCart })
}


module.exports = {
   getCartByUser,
}