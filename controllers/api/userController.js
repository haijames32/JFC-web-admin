const myModel = require('../../models/MyModel')

const login = async (req, res, next) => {
   try {
      const user = await myModel.userModel.findOne({ username: req.body.username }).populate('addressDefault')
      console.log(user);
      if (user) {
         if (user.passwd == req.body.passwd)
            res.status(200).json({ message: 'Đăng nhập thành công.', data: user })
         else
            res.status(400).json({ message: 'Không đúng mật khẩu.' })
      } else {
         res.status(400).json({ message: 'Tài khoản không tồn tại.' })
      }
   } catch (error) {
      console.log('Error Login: ', error);
   }
}


module.exports = {
   login,
}