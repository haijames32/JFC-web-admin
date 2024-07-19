const myModel = require('../../models/MyModel')

const listCategory = async (req, res, next) => {
   const listCate = await myModel.categoryModel.find()
   res.status(200).json({ data: listCate })
}

const listProdByCategory = async (req, res, next) => {
   const listProd = await myModel.productModel.find({ category: req.params.id })
   res.status(200).json({ data: listProd })
}


module.exports = {
   listCategory,
   listProdByCategory
}