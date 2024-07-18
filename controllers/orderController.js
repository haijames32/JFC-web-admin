const myModel = require('../models/MyModel')

const getListOrder = async (req, res, next) => {
   let finder = null

   // Search by Name user
   const search = req.query.searchOrder
   if (search) {
      const regex = new RegExp('.*' + search + '.*', 'i');
      finder = { name: { $regex: regex } }
   }

   const listOrder = await myModel.orderModel.find(finder).sort({ status: 1 }).populate('userId')
   res.render('order/list', { listOrder })
}

const getOrderDetails = async (req, res, next) => {
   // const id = req.params.id
   // const order = await myModel.orderModel.findById({ _id: id })
   // const orderDetails = await myModel.orderDetailsModel.find().populate('orderId').populate('productId')
   res.render('order/details')
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
      const body = req.body.changeStatus
      let status = ''

      switch (body) {
         case 'confirm': status = 'Đã xác nhận'; break
         case 'delivering': status = 'Đang giao hàng'; break
         case 'finish': status = 'Hoàn thành'; break
         default: status = ''; break
      }

      await myModel.orderModel.findByIdAndUpdate({ _id: id }, { status })
      return res.redirect('/orders')
   } catch (error) {
      console.log('Error PUT Status: ', error);
   }
}


module.exports = {
   getListOrder,
   putStatus,
   getListFinished,
   getOrderDetails
}