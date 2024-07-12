const myModel = require('../models/MyModel')

const getListUser = async (req, res, next) => {
   const listUser = await myModel.userModel.find()
   res.render('user/list', { listUser })
}

module.exports = {
   getListUser
}