const myModel = require('../models/MyModel')

const getListOrder = async (req, res, next) => {
   let finder = null
   let listOrder
   let user
   // Search by Name user
   const search = req.query.searchOrder
   if (search) {
      const regex = new RegExp('.*' + search + '.*', 'i');
      finder = { name: { $regex: regex } }
      user = await myModel.userModel.find(finder)
   }
   if (user) {
      listOrder = await myModel.orderModel.find({ userId: user }).sort({ date: -1 }).populate('userId')
   } else {
      listOrder = await myModel.orderModel.find({}).sort({ date: -1 }).populate('userId')
   }
   res.render('order/list', { listOrder, search })
}

const getOrderDetails = async (req, res, next) => {
   const order = await myModel.orderModel.findById({ _id: req.params.id }).populate('userId')
   const user = await myModel.userModel.findById({ _id: order.userId._id })
   const addressOfUser = await myModel.addressModel.findById({ _id: user.addressDefault })
   const { receiver, phoneNumber, street, commune, district, city } = addressOfUser
   const address = `${receiver}, ${phoneNumber}.
${street}, ${commune}, ${district}, ${city}.`
   // for (const property in iaddress) {
   //    if (typeof iaddress[property] === 'string') {
   //       address += iaddress[property] + ', ';
   //    }
   // }
   const orderDetails = await myModel.orderDetailsModel.find({ orderId: order._id }).populate('orderId').populate('productId')
   res.render('order/details', { order, orderDetails, address })
}

const getListFinished = async (req, res, next) => {
   let finder = null
   // Search by Name user
   const search = req.query.searchOrder
   if (search) {
      const regex = new RegExp('.*' + search + '.*', 'i');
      finder = { name: { $regex: regex } }
   }
   const listOrder = await myModel.orderModel.find({ finder, status: 'Hoàn thành' })
   res.render('order/finished', { listOrder })
}

const putStatus = async (req, res, next) => {
   try {
      const id = req.params.id
      const status = req.body.changeStatus
      await myModel.orderModel.findByIdAndUpdate({ _id: id }, { status })
      return res.redirect('/orders')
   } catch (error) {
      console.log('Error PUT Status: ', error);
   }
}

const putStatusDetails = async (req, res, next) => {
   try {
      const id = req.params.id
      const status = req.body.changeStatus
      await myModel.orderModel.findByIdAndUpdate({ _id: id }, { status })
      return res.redirect(`/orders/${id}`)
   } catch (error) {
      console.log('Error PUT Status: ', error);
   }
}

module.exports = {
   getListOrder,
   putStatus,
   getListFinished,
   getOrderDetails,
   putStatusDetails
}