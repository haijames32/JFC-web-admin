const myModel = require('../models/MyModel')
const imgkit = require('../imagekit')


const getListProd = async (req, res, next) => {
   const listProd = await myModel.productModel.find()
   res.render('product/list', { listProd })
}

const detailsProd = async (req, res, next) => {
   const product = await myModel.productModel.findById({ _id: req.params.id })
   res.render('product/list', { product })
}

const postProd = async (req, res, next) => {
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
         return res.redirect('/products')
      } catch (error) {
         console.log('Error ADD: ', error);
      }
   }
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
         await myModel.userModel.findByIdAndUpdate({ _id: id }, body)
         console.log('PUT: ', { id, body });
         return res.redirect('/products');
      } catch (error) {
         console.log("Error PUT: ", error);
      }
   }
}

const deleteProd = async (req, res, next) => {
   try {
      await myModel.productModel.delete({ _id: req.params.id })
      return res.redirect('/products')
   } catch (error) {
      console.log('Error Delete: ', error);
   }
}

const forceDeleteProd = async (req, res, next) => {
   try {
      // const id = req.params.id
      // const product = await myModel.productModel.findById({ _id: id })
      const product = await myModel.productModel.findByIdAndDelete({ _id: req.params.id })
      await imgkit.deleteImage(product.imageId)
      return res.redirect('/products')
   } catch (error) {
      console.log("Error Force Delete: ", error);
   }
}

module.exports = {
   getListProd,
   detailsProd,
   postProd,
   putProd,
   deleteProd,
   forceDeleteProd,
}