const express = require('express');
const router = express.Router();
const trashCtrl = require('../controllers/trashController')

/* GET users listing. */
router.get('/', trashCtrl.getTrash);
router.delete('/:id/force', trashCtrl.forceDeleteProd)
router.patch('/:id/restore', trashCtrl.restoreProd)


module.exports = router;
