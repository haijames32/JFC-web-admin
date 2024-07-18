const myModel = require('../models/MyModel')

const getListOrder = async (req, res, next) => {
   const listOrder = await myModel.orderModel.find().populate('userId')
   const listOrderf = await myModel.orderDetailsModel.find().populate('orderId').populate('productId')
   res.render('order/list', { listOrder })
}


module.exports = {
   getListOrder
}