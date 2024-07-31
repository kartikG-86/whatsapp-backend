const express = require('express')
const router = express.Router()


router.post('/login', require('../controller/auth/login'))
router.post('/signup', require('../controller/auth/signup'))
router.post('/reset', require('../controller/auth/resetPassword'))

module.exports = router