const myModel = require('../../models/MyModel')
const { hashPassword, checkHashedPassword } = require('../../services/userService')

const login = async (req, res) => {
   try {
      const { username, passwd } = req.body
      const user = await myModel.userModel.findOne({ username: username }).populate('addressDefault')
      if (user) {
         const check = checkHashedPassword(passwd, user.passwd)
         if (check)
            res.status(200).json({ message: 'Đăng nhập thành công', data: user })
         else
            res.status(400).json({ message: 'Không đúng mật khẩu' })
      } else {
         res.status(400).json({ message: 'Tài khoản không tồn tại' })
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
         rePasswd,
         dateOfBirth,
         gender,
      } = req.body
      const user = await myModel.userModel.findOne({ username: username })
      if (user) {
         return res.status(400).json({ message: 'Tài khoản đã tồn tại' })
      }
      if (rePasswd !== passwd) {
         return res.status(400).json({ message: 'Xác nhận mật khẩu phải trùng với mật khẩu' })
      }
      const pw = hashPassword(passwd)
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
   } catch (error) {
      console.log('Error: ', error);
      return res.status(400).json({ message: 'Đã xảy ra lỗi' })
   }
}

const changePassword = async (req, res) => {
   try {
      const { id } = req.params
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

module.exports = {
   login,
   register,
   changePassword
}