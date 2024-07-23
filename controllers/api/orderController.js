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
      let status = '', totalOfOrder = 0
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
      if (Array.isArray(Items)) {
         for (const item of Items) {
            totalOfOrder += item.totalOfItem
         }
      } else {
         totalOfOrder = Items.totalOfItem
      }
      const createOrder = new myModel.orderModel({
         userId,
         date,
         status,
         paymentMethod,
         total: totalOfOrder
      })
      const newOrder = await createOrder.save()
      if (Array.isArray(Items)) {
         for (const item of Items) {
            const createItem = new myModel.orderDetailsModel({
               orderId: newOrder.id,
               productId: item.productId,
               priceOfItem: item.priceOfItem,
               numOfItem: item.numOfItem,
               totalOfItem: item.totalOfItem
            })
            createItem.save()
            // Delete products in the Cart after create Order
            myModel.cartModel.findOneAndDelete({ userId }, { productId: item.productId })
         }
      } else {
         const createItem = new myModel.orderDetailsModel({
            orderId: newOrder.id,
            productId: Items.productId,
            priceOfItem: Items.priceOfItem,
            numOfItem: Items.numOfItem,
            totalOfItem: Items.totalOfItem
         })
         createItem.save()
         myModel.cartModel.findOneAndDelete({ userId }, { productId: Items.productId })
      }
      res.status(200).json({ item: newOrder })
   } catch (error) {
      console.log('Error Post Order: ', error);
      res.status(400).json({ message: 'Có lỗi xảy ra' })
   }
}

module.exports = {
   getOrderByUser,
   getOrderDetails,
   postOrder,
}