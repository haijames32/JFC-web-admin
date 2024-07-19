const express = require('express');
const router = express.Router();
const { userCtrl } = require('../controllers/api/index')

const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.post('/login', userCtrl.login)


module.exports = router