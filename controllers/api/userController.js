const myModel = require('../../models/MyModel')
const { hashPassword, checkHashedPassword } = require('../../services/userService')

const login = async (req, res, next) => {
   try {
      const user = await myModel.userModel.findOne({ username: req.body.username }).populate('addressDefault')
      if (user) {
         const check = checkHashedPassword(req.body.passwd, user.passwd)
         if (check)
            res.status(200).json({ message: 'Đăng nhập thành công', data: user })
         else
            res.status(400).json({ message: 'Không đúng mật khẩu' })
      } else {
         res.status(400).json({ message: 'Tài khoản không tồn tại' })
      }
   } catch (error) {
      console.log('Error Login: ', error);
      res.status(400).json({ message: 'Có lỗi xảy ra' })
   }
}

const register = async (req, res, next) => {
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
         res.status(400).json({ message: 'Tài khoản đã tồn tại' })
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
         res.status(200).json({ message: 'Đăng ký thành công', data: newUser })
      }
   } catch (error) {
      console.log('Error Register: ', error);
      res.status(400).json({ message: 'Có lỗi xảy ra' })
   }
}

const getProfile = async (req, res, next) => {
   const user = await myModel.userModel.findById({ _id: req.params.id })
   res.status(200).json({ data: user })
}

const editProfile = async (req, res, next) => {
   try {
      const id = req.params.id
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
      res.status(400).json({ message: 'Có lỗi xảy ra' })
   }
}

const changePassword = async (req, res, next) => {
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
            res.status(400).json({ message: 'Xác nhận mật khẩu phải trùng mật khẩu mới' })
         } else {
            const hashPw = hashPassword(newPasswd)
            myModel.userModel.findByIdAndUpdate({ _id: id }, { passwd: hashPw })
            res.status(200).json({ message: 'Đổi mật khẩu thành công', data: hashPw })
         }
      } else {
         res.status(400).json({ message: 'Sai mật khẩu cũ' })
      }
   } catch (error) {
      console.log('Error :', error)
      res.status(400).json({ message: 'Có lỗi xảy ra' })
   }
}

const getAddressByUser = async (req, res, next) => {
   const listAddress = await myModel.addressModel.find({ userId: req.params.id })
   res.status(200).json({ data: listAddress })
}

const setAddressDefault = async (req, res, next) => {
   try {
      const { address } = req.body
      const newAddress = await myModel.userModel.findByIdAndUpdate({ _id: req.params.id }, { addressDefault: address })
      res.status(200).json({ data: newAddress })
   } catch (error) {
      console.log('Error: ', error);
      res.status(400).json({ message: 'Có lỗi xảy ra' })
   }
}

const postAddress = async (req, res, next) => {
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
         res.status(400).json({ message: 'Số điện thoại phải đủ 10 số' })
         return
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
         res.status(200).json({ data: newAddress })
      }
   } catch (error) {
      console.log('Error: ', error)
      res.status(400).json({ message: 'Có lỗi xảy ra' })
   }
}

const deleteAddress = async (req, res, next) => {
   try {
      const address = await myModel.addressModel.findByIdAndDelete({ _id: req.params.id })
      res.status(200).json({ data: address })
   } catch (error) {
      console.log('Error: ', error)
      res.status(400).json({ message: 'Có lỗi xảy ra' })
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