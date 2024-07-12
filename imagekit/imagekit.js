const ImageKit = require("imagekit")

const imagekit = new ImageKit({
   publicKey: 'public_F3whUmHQXoFwcORplUBA2iun0Uo=',
   privateKey: 'private_EVRLtH8S4pNIrtPiuZw0KWOEsQs=',
   urlEndpoint: 'https://ik.imagekit.io/haijames32/'
});
// const imagekit = new ImageKit({
//    publicKey: process.env.IMAGE_PUBLIC_KEY,
//    privateKey: process.env.IMAGE_PRIVATE_KEY,
//    urlEndpoint: process.env.IMAGE_ROOT_URL
// });

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

const deleteImage = async (filePath, newFileName) => {
   try {
      const res = await imagekit.deleteFile()
      return res
   } catch (error) {
      console.log('Lỗi DeleteImage: ', error);
   }
}

module.exports = { imagekit, uploadImage, deleteImage }