const express = require('express');
const router = express.Router();
const productCtrl = require('../controllers/productController')
const multer = require('multer');
const multerImg = multer({ dest: 'public/uploads' })
const bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.get('/', productCtrl.getListProd)
router.get('/cate/:id', productCtrl.getListProd)
router.get('/:id/details', productCtrl.detailsProd)
router.post('/', multerImg.single('post_img_file'), productCtrl.postProd)
router.get('/:id/edit', productCtrl.getPutProd)
router.put('/:id/edit', multerImg.single('put_img_file'), productCtrl.putProd)
router.delete('/:id', productCtrl.deleteProd)

module.exports = router