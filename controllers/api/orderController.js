const myModel = require('../../models/MyModel')
const {
   day,
   hours,
   minutes,
   month,
   year,
   confirmed,
   paidWaitConfirm,
   payCOD,
   payZaloPay,
   waitConfirm,
   cancelled
} = require('../../utils/index')

const getOrderByUser = async (req, res) => {
   try {
      const listOrder = await myModel.orderModel
         .find({ userId: req.params.id })
         .populate('userId')
      return res.status(200).json({ data: listOrder })
   } catch (error) {
      console.log('Error: ', error);
      return res.status(400).json({ message: 'Đã xảy ra lỗi' })
   }
}

const getOrderDetails = async (req, res) => {
   try {
      const order = await myModel.orderModel.findById({ _id: req.params.id })
      const orderDetails = await myModel.orderDetailsModel
         .find({ orderId: order.id })
         .populate('orderId')
         .populate('productId')
      return res.status(200).json({ data: orderDetails })
   } catch (error) {
      console.log('Error: ', error);
      return res.status(400).json({ message: 'Đã xảy ra lỗi' })
   }
}

const postOrder = async (req, res) => {
   try {
      let status = '', totalOfOrder = 0
      const {
         userId,
         address,
         paymentMethod,
         Items
      } = req.body
      const date = `${hours}:${minutes} ${day}/${month}/${year}`
      switch (paymentMethod) {
         case payCOD: status = waitConfirm; break
         case payZaloPay: status = paidWaitConfirm; break
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
         address,
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
            await createItem.save()
            // Delete products in the Cart after create Order
            await myModel.cartModel.findOneAndDelete({ userId }, { productId: item.productId })
         }
      } else {
         const createItem = new myModel.orderDetailsModel({
            orderId: newOrder.id,
            productId: Items.productId,
            priceOfItem: Items.priceOfItem,
            numOfItem: Items.numOfItem,
            totalOfItem: Items.totalOfItem
         })
         await createItem.save()
         await myModel.cartModel.findOneAndDelete({ userId }, { productId: Items.productId })
      }
      return res.status(200).json({ item: newOrder })
   } catch (error) {
      console.log('Error: ', error)
      return res.status(400).json({ message: 'Đã xảy ra lỗi' })
   }
}

const changeOrderAddress = async (req, res) => {
   try {
      const id = req.params.id
      const { address } = req.body
      const order = await myModel.orderModel.findById({ _id: id })
      if (order.status == waitConfirm || order.status == paidWaitConfirm || order.status == confirmed) {
         await myModel.orderModel.findByIdAndUpdate({ _id: id }, { address })
         const od = await myModel.orderModel
            .findById({ _id: id })
            .populate('userId')
            .populate('address')
         return res.status(200).json({ data: od })
      } else {
         return res.status(400).json({ message: 'Không thể thay đổi địa chỉ' })
      }
   } catch (error) {
      console.log('Error: ', error)
      return res.status(400).json({ message: 'Đã xảy ra lỗi' })
   }
}

const cancelOrder = async (req, res) => {
   try {
      const id = req.params.id
      const order = await myModel.orderModel.findById({ _id: id })
      if (order.status == waitConfirm || order.status == paidWaitConfirm || order.status == confirmed) {
         await myModel.orderModel.findByIdAndUpdate({ _id: id }, { status: cancelled })
         const od = await myModel.orderModel
            .findById({ _id: id })
            .populate('userId')
            .populate('address')
         return res.status(200).json({ data: od, message: 'Đã hủy đơn hàng' })
      } else {
         return res.status(400).json({ message: 'Không thể hủy đơn hàng' })
      }
   } catch (error) {
      console.log('Error: ', error)
      return res.status(400).json({ message: 'Đã xảy ra lỗi' })
   }
}

module.exports = {
   getOrderByUser,
   getOrderDetails,
   postOrder,
   changeOrderAddress,
   cancelOrder,
}