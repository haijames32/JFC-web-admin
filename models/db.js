const mongoose = require('mongoose');
mongoose.connect(`mongodb://127.0.0.1:27017/test`)
   .then(() => {
      console.log('Đã kết nối MongoDB')
   })
   .catch((err) =>
      console.log("Lỗi kết nối MongoDB: ", err)
   )

module.exports = { mongoose };