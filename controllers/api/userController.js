const myModel = require('../../models/MyModel')
const { hashPassword, checkHashedPassword } = require('../../services/userService')

const login = async (req, res) => {
   try {
      const user = await myModel.userModel
         .findOne({ username: req.body.username })
         .populate('addressDefault')
      if (user) {
         const check = checkHashedPassword(req.body.passwd, user.passwd)
         if (check) {
            return res.status(200).json({ message: 'Đăng nhập thành công', data: user })
         } else {
            return res.status(400).json({ message: 'Không đúng mật khẩu' })
         }
      } else {
         return res.status(400).json({ message: 'Tài khoản không tồn tại' })
      }
   } catch (error) {
      console.log('Error: ', error);
      return res.status(400).json({ message: 'Đã xảy ra lỗi' })
   }
}

const register = async (req, res) => {
   try {
      const {
         name,
         username,
         email,
         phoneNumber,
         passwd,
         dateOfBirth,
         gender,
      } = req.body
      const pw = hashPassword(passwd)
      const user = await myModel.userModel.findOne({ username: username })
      if (user) {
         return res.status(400).json({ message: 'Tài khoản đã tồn tại' })
      } else {
         const body = new myModel.userModel({
            name,
            username,
            email,
            phoneNumber,
            passwd: pw,
            dateOfBirth,
            gender: gender ?? 'None',
         })
         const newUser = await body.save()
         return res.status(200).json({ message: 'Đăng ký thành công', data: newUser })
      }
   } catch (error) {
      console.log('Error: ', error);
      return res.status(400).json({ message: 'Đã xảy ra lỗi' })
   }
}

const getProfile = async (req, res) => {
   try {
      const user = await myModel.userModel.findById({ _id: req.params.id })
      return res.status(200).json({ data: user })
   } catch (error) {
      console.log('Error: ', error)
      return res.status(400).json({ message: 'Đã xảy ra lỗi' })
   }

}

const editProfile = async (req, res) => {
   try {
      const id = req.params.id
      const {
         name,
         username,
         email,
         phoneNumber,
         gender,
         dateOfBirth
      } = req.body
      const body = {
         name,
         username,
         email,
         phoneNumber,
         dateOfBirth,
         gender,
      }
      await myModel.userModel.findByIdAndUpdate({ _id: id }, body)
      return res.status(200).json({ message: 'Cập nhật thành công', data: body })
   } catch (error) {
      console.log('Error: ', error)
      return res.status(400).json({ message: 'Đã xảy ra lỗi' })
   }
}

const changePassword = async (req, res) => {
   try {
      const id = req.params.id
      const {
         oldPasswd,
         newPasswd,
         confirmNewPasswd
      } = req.body
      const user = await myModel.userModel.findById({ _id: id })
      const check = checkHashedPassword(oldPasswd, user.passwd)
      if (check) {
         if (newPasswd !== confirmNewPasswd) {
            return res.status(400).json({ message: 'Xác nhận mật khẩu phải trùng mật khẩu mới' })
         } else {
            const hashPw = hashPassword(newPasswd)
            await myModel.userModel.findByIdAndUpdate({ _id: id }, { passwd: hashPw })
            return res.status(200).json({ message: 'Đổi mật khẩu thành công', data: hashPw })
         }
      } else {
         return res.status(400).json({ message: 'Sai mật khẩu cũ' })
      }
   } catch (error) {
      console.log('Error :', error)
      return res.status(400).json({ message: 'Đã xảy ra lỗi' })
   }
}

const getAddressByUser = async (req, res) => {
   try {
      const listAddress = await myModel.addressModel.find({ userId: req.params.id })
      return res.status(200).json({ data: listAddress })
   } catch (error) {
      console.log('Error: ', error)
      return res.status(400).json({ message: 'Đã xảy ra lỗi' })
   }
}

const setAddressDefault = async (req, res) => {
   try {
      const { address } = req.body
      await myModel.userModel.findByIdAndUpdate({ _id: req.params.id }, { addressDefault: address })
      const user = await myModel.userModel.findById({ _id: req.params.id })
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
      } else {
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
      }
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
   login,
   register,
   getProfile,
   editProfile,
   changePassword,
   getAddressByUser,
   setAddressDefault,
   postAddress,
   deleteAddress,
}