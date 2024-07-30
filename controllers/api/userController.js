const myModel = require('../../models/MyModel')


const getProfile = async (req, res) => {
   try {
      const user = await myModel.userModel.findById({ _id: req.params.id })
      res.status(200).json({ data: user })
   } catch (error) {
      console.log('Error: ', error)
      res.status(400).json({ message: 'Đã xảy ra lỗi' })
   }
}

const editProfile = async (req, res) => {
   try {
      const { id } = req.params
      const { name, username, email, phoneNumber, gender, dateOfBirth } = req.body
      const body = {
         name,
         username,
         email,
         phoneNumber,
         dateOfBirth,
         gender,
      }
      await myModel.userModel.findByIdAndUpdate({ _id: id }, body)
      res.status(200).json({ message: 'Cập nhật thành công', data: body })
   } catch (error) {
      console.log('Error edit: ', error)
      res.status(400).json({ message: 'Đã xảy ra lỗi' })
   }
}

const getAddressByUser = async (req, res) => {
   try {
      const listAddress = await myModel.addressModel.find({ userId: req.params.id })
      res.status(200).json({ data: listAddress })
   } catch (error) {
      console.log('Error: ', error)
      res.status(400).json({ message: 'Đã xảy ra lỗi' })
   }
}

const setAddressDefault = async (req, res) => {
   try {
      const { id } = req.params
      const { address } = req.body
      await myModel.userModel.findByIdAndUpdate({ _id: id }, { addressDefault: address })
      const user = await myModel.userModel.findById({ _id: id }).populate('addressDefault')
      return res.status(200).json({ data: user.addressDefault })
   } catch (error) {
      console.log('Error: ', error);
      return res.status(400).json({ message: 'Đã xảy ra lỗi' })
   }
}

const postAddress = async (req, res) => {
   try {
      const {
         userId,
         receiver,
         phoneNumber,
         street,
         commune,
         district,
         city
      } = req.body
      if (phoneNumber.length < 10 || phoneNumber.length > 10) {
         return res.status(400).json({ message: 'Số điện thoại phải đủ 10 số' })
      }
      const createAddress = new myModel.addressModel({
         userId,
         receiver,
         phoneNumber,
         street,
         commune,
         district,
         city
      })
      const newAddress = await createAddress.save()
      return res.status(200).json({ data: newAddress })
   } catch (error) {
      console.log('Error: ', error)
      return res.status(400).json({ message: 'Đã xảy ra lỗi' })
   }
}

const changeAddress = async (req, res) => {
   try {
      const { id } = req.params
      const {
         receiver,
         phoneNumber,
         street,
         commune,
         district,
         city
      } = req.body
      if (phoneNumber.length < 10 || phoneNumber.length > 10) {
         return res.status(400).json({ message: 'Số điện thoại phải đủ 10 số' })
      }
      const body = {
         receiver,
         phoneNumber,
         street,
         commune,
         district,
         city
      }
      await myModel.addressModel.findByIdAndUpdate({ _id: id }, body)
      const newAddress = await myModel.addressModel.findById({ _id: id })
      return res.status(200).json({ data: newAddress })
   } catch (error) {
      console.log('Error: ', error)
      return res.status(400).json({ message: 'Đã xảy ra lỗi' })
   }
}

const deleteAddress = async (req, res) => {
   try {
      const address = await myModel.addressModel.findByIdAndDelete({ _id: req.params.id })
      return res.status(200).json({ data: address })
   } catch (error) {
      console.log('Error: ', error)
      return res.status(400).json({ message: 'Đã xảy ra lỗi' })
   }
}

module.exports = {
   getProfile,
   editProfile,
   getAddressByUser,
   setAddressDefault,
   postAddress,
   changeAddress,
   deleteAddress,
}