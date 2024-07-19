const myModel = require('../../models/MyModel')
const { hashPassword, checkHashedPassword } = require('../../services/userService')

const login = async (req, res, next) => {
   try {
      const user = await myModel.userModel.findOne({ username: req.body.username }).populate('addressDefault')
      if (user) {
         const check = checkHashedPassword(req.body.passwd, user.passwd)
         if (check)
            res.status(200).json({ message: 'Đăng nhập thành công.', data: user })
         else
            res.status(400).json({ message: 'Không đúng mật khẩu.' })
      } else {
         res.status(400).json({ message: 'Tài khoản không tồn tại.' })
      }
   } catch (error) {
      console.log('Error Login: ', error);
      res.status(400).json({ message: error })
   }
}

const register = async (req, res, next) => {
   try {
      const {
         name,
         username,
         email,
         phone,
         passwd,
         dateOfBirth,
      } = req.body
      const pw = hashPassword(passwd)
      const user = await myModel.userModel.findOne({ username: username })
      if (user) {
         res.status(400).json({ message: 'Tài khoản đã tồn tại.' })
      } else {
         const body = new myModel.userModel({
            name,
            username,
            email,
            phone,
            passwd: pw,
            dateOfBirth,
         })
         const newUser = await body.save()
         res.status(200).json({ message: 'Đăng ký thành công.', data: newUser })
      }
   } catch (error) {
      console.log('Error Register: ', error);
      res.status(400).json({ message: error })
   }
}


module.exports = {
   login,
   register
}