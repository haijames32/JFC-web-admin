const myModel = require('../models/MyModel')
const imgkit = require('../imagekit')

const getTrash = async (req, res, next) => {
   const listProd = await myModel.productModel.findWithDeleted({ deleted: true }).populate('category')
   res.render('trash/trash', { listProd })
}

const restoreProd = async (req, res, next) => {
   try {
      await myModel.productModel.restore({ _id: req.params.id })
      return res.redirect('/trash')
   } catch (error) {
      console.log("Lỗi RESTORE: ", error);
   }
}

const forceDeleteProd = async (req, res, next) => {
   try {
      const product = await myModel.productModel.findByIdAndDelete({ _id: req.params.id })
      await imgkit.deleteImage(product.imageId)
      return res.redirect('/trash')
   } catch (error) {
      console.log("Error Force Delete: ", error);
   }
}

module.exports = {
   getTrash,
   restoreProd,
   forceDeleteProd
}