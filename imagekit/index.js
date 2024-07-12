require('dotenv').config()
const ImageKit = require("imagekit")

const imagekit = new ImageKit({
   publicKey: process.env.IMAGE_PUBLIC_KEY,
   privateKey: process.env.IMAGE_PRIVATE_KEY,
   urlEndpoint: process.env.IMAGE_URL
});

const uploadImage = async (filePath, fileName) => {
   try {
      const res = await imagekit.upload({
         file: filePath, //required
         fileName: fileName,   //required
         useUniqueFileName: false, //Nếu để true thì sẽ thêm các ký tự vào tên ảnh khi upload
      })
      return res
   } catch (error) {
      console.log("Lỗi upload: ", error);
   }
}

const deleteImage = async (fileId) => {
   try {
      const res = await imagekit.deleteFile(fileId)
      return res
   } catch (error) {
      console.log('Lỗi DeleteImage: ', error);
   }
}

module.exports = {
   imagekit,
   uploadImage,
   deleteImage
}