const myModel = require('../../models/MyModel')

const listCategory = async (req, res) => {
   try {
      const listCate = await myModel.categoryModel.find()
      return res.status(200).json({ data: listCate })
   } catch (error) {
      console.log('Error: ', error);
      return res.status(400).json({ message: 'Đã xảy ra lỗi' })
   }
}

const listProdByCategory = async (req, res) => {
   try {
      const listProd = await myModel.productModel.find({ category: req.params.id })
      return res.status(200).json({ data: listProd })
   } catch (error) {
      console.log('Error: ', error);
      return res.status(400).json({ message: 'Đã xảy ra lỗi' })
   }
}

const productDetails = async (req, res) => {
   try {
      const product = await myModel.productModel
         .findById({ _id: req.params.id })
         .populate('category')
      return res.status(200).json({ data: product })
   } catch (error) {
      console.log('Error: ', error);
      return res.status(400).json({ message: 'Đã xảy ra lỗi' })
   }
}


module.exports = {
   listCategory,
   listProdByCategory,
   productDetails
}