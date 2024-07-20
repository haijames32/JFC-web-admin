const myModel = require('../../models/MyModel')
const now = new Date()
const year = now.getFullYear()
const month = now.getMonth() + 1
const day = now.getDate()
const hours = now.getHours()
const minutes = now.getMinutes()

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

const postOrder = async (req, res, next) => {
   try {
      let status = '', totalOfItem = [], totalOfOrder = 0
      const {
         userId,
         paymentMethod,
         Items
      } = req.body
      const date = `${hours}:${minutes} ${day}/${month}/${year}`
      switch (paymentMethod) {
         case 'Thanh toán khi nhận hàng': status = 'Chờ xác nhận'; break
         case 'Thanh toán qua ZaloPay': status = 'Đã thanh toán và chờ xác nhận'; break
         default: status = 'None'; break
      }

      Items.map((item, index) => {
         totalOfItem = item.numOfItem * item.priceOfItem
      })

      console.log(totalOfItem);
      // const body = new myModel.orderModel({
      //    userId,
      //    date,
      //    status

      // })
      // const newOrder = await body.save()

   } catch (error) {
      console.log('Error Post Order: ', error);
      res.status(400).json({ message: error })
   }
}

module.exports = {
   getOrderByUser,
   getOrderDetails,
   postOrder,
}