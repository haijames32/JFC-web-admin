var express = require('express');
var router = express.Router();
const productCtrl = require('../controllers/productController')
const multer = require('multer');
const multerImg = multer({ dest: 'public/uploads' })
const bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.get('/', productCtrl.getListProd)
router.get('/:id', productCtrl.detailsProd)
router.post('/', multerImg.single('post_img_file'), productCtrl.postProd)
router.put('/:id', multerImg.single('put_img_file'), productCtrl.putProd)
router.delete('/:id', productCtrl.deleteProd)
router.delete('/:id/force', productCtrl.forceDeleteProd)


module.exports = router