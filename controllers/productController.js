const myModel = require('../models/MyModel')
const fs = require('fs')
const imgkit = require('../imagekit')

const rootCate = '66913f96a4a35e2e6efb07f1'

const getListProd = async (req, res, next) => {
   let finder = null

   // Filter by Category
   const cateId = req.query.filterCate
   if (cateId) {
      finder = { category: cateId }
   }

   // Search by Name
   const search = req.query.searchName
   if (search) {
      finder = { name: { $regex: '.*' + search + '.*' } }
   }


   const listProd = await myModel.productModel.find(finder).populate('category').sort({ name: 1 }).limit()
   const listCate = await myModel.categoryModel.find()
   res.render('product/list', { listProd, listCate, cateId })
}

const detailsProd = async (req, res, next) => {
   const product = await myModel.productModel.findById({ _id: req.params.id })
   res.render('product/details', { product })
}

const postProd = async (req, res, next) => {
   const cateId = req.params.id
   if (req.method == 'POST') {
      try {
         const { name, price, description, category } = req.body
         const filePath = req.file.path
         const fileName = req.file.originalname;

         // Đọc tệp đã tải lên dưới dạng buffer
         const fileBuffer = fs.readFileSync(filePath);

         const response = await imgkit.uploadImage(fileBuffer, fileName)

         // Xóa tệp đã tải lên tạm thời
         fs.unlinkSync(filePath)

         const newProd = new myModel.productModel({
            name,
            price,
            image: response.url,
            description,
            category,
            imageId: response.fileId
         })
         const new_prod = await newProd.save()
         console.log('ADD :', new_prod);
         return res.redirect(`/products`)
      } catch (error) {
         console.log('Error ADD: ', error);
      }
   }
}

const getPutProd = async (req, res, next) => {
   const product = await myModel.productModel.findById({ _id: req.params.id }).populate('category')
   const listCate = await myModel.categoryModel.find()
   res.render('product/edit', { product, listCate })
}

const putProd = async (req, res, next) => {
   if (req.method == 'PUT') {
      try {
         const id = req.params.id
         const product = await myModel.productModel.findById({ _id: id })
         const { image, imageId } = product
         const { name, price, description, category } = req.body
         let imgProd, imgId
         if (req.file) {
            const filePath = req.file.path
            const fileName = req.file.originalname;

            // Đọc tệp đã tải lên dưới dạng buffer
            const fileBuffer = fs.readFileSync(filePath);

            const response = await imgkit.uploadImage(fileBuffer, fileName)
            imgProd = response.url
            imgId = response.fileId
            // Xóa tệp đã tải lên tạm thời
            fs.unlinkSync(filePath)

            // Xóa image cũ khi update image mới lên imagekit
            await imgkit.deleteImage(imageId)
         }
         const body = {
            name,
            price,
            image: imgProd || image,
            description,
            category,
            imageId: imgId || imageId
         }
         await myModel.productModel.findByIdAndUpdate({ _id: id }, body)
         console.log('PUT: ', { id, body });
         return res.redirect(`/products`);
      } catch (error) {
         console.log("Error PUT: ", error);
      }
   }
}

const deleteProd = async (req, res, next) => {
   try {
      await myModel.productModel.delete({ _id: req.params.id })
      return res.redirect(`/products`)
   } catch (error) {
      console.log('Error Delete: ', error);
   }
}

const forceDeleteProd = async (req, res, next) => {
   try {
      await myModel.productModel.findByIdAndDelete({ _id: req.params.id })
      // await imgkit.deleteImage(product.imageId)
      return res.redirect('/trash')
   } catch (error) {
      console.log("Error Force Delete: ", error);
   }
}

module.exports = {
   getListProd,
   detailsProd,
   postProd,
   getPutProd,
   putProd,
   deleteProd,
   forceDeleteProd,
}