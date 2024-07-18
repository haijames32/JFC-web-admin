const myModel = require('../models/MyModel')

const getListUser = async (req, res, next) => {
   let finder = null

   // Search by Name
   const search = req.query.searchUser
   if (search) {
      const regex = new RegExp('.*' + search + '.*', 'i');
      finder = { name: { $regex: regex } }
   }

   const listUser = await myModel.userModel.find(finder).sort({ name: 1 }).limit(5)
   res.render('user/list', { listUser, search })
}

const getDetailsUser = async (req, res, next) => {
   const user = await myModel.userModel.findById({ _id: req.params.id })
   res.render('user/details', { user })
}

module.exports = {
   getListUser,
   getDetailsUser
}