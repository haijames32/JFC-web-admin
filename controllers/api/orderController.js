const myModel = require('../../models/MyModel')

const getOrderByUser = async (req, res, next) => {
   const listOrder = await myModel.orderModel.find({ userId: req.params.id }).populate('userId')
   res.status(200).json({ data: listOrder })
}

const getOrderDetails = async (req, res, next) => {
   const order = await myModel.orderModel.findById({ _id: req.params.id })
   const orderDetails = await myModel.orderDetailsModel
      .find({ orderId: order.id })
      .populate('orderId')
      .populate('productId')
   res.status(200).json({ data: orderDetails })
}



module.exports = {
   getOrderByUser,
   getOrderDetails,
}