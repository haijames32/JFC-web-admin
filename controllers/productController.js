const myModel = require('../models/MyModel')
const fs = require('fs')
const imgkit = require('../imagekit')

const rootCate = '66913f96a4a35e2e6efb07f1'

const getListProd = async (req, res, next) => {
   let finder = null
   const listCate = await myModel.categoryModel.find()

   const cateId = req.params.id
   if (cateId) finder = { category: cateId }

   // Filter by Category
   const categoryId = req.query.filterCate
   let indexCate = null
   if (categoryId) {
      finder = { category: categoryId }
      listCate.map((item, index) => {
         if (item.id == categoryId) indexCate = index
      })
   }

   // Search by Name
   const search = req.query.searchName
   if (search) finder = { name: { $regex: '.*' + search + '.*' } }


   //Skip Product
   let skipProd = 0
   const skip = req.query.skipProduct
   if (skip) {
      switch (skip) {
         case '0': skipProd = 0; break
         case '5': skipProd = 5; break
         case '10': skipProd = 10; break
         case '15': skipProd = 15; break
         case '20': skipProd = 20; break
         case '25': skipProd = 25; break
         case '30': skipProd = 30; break
      }
   }

   const listProd = await myModel.productModel.find(finder).skip(skipProd).populate('category').sort({ category: 1 }).limit()
   const listProdDeleted = await myModel.productModel.countDocumentsWithDeleted({ deleted: true })
   res.render('product/list', { listProd, listCate, listProdDeleted, cateId, indexCate, skipProd })
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
         return res.redirect(`/products/`)
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


module.exports = {
   getListProd,
   detailsProd,
   postProd,
   getPutProd,
   putProd,
   deleteProd,
}