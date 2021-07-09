const express = require('express')
const router = express.Router()

//Controllers
const {signUpController} = require('../controllers/auth-controller.js')

router.post('/signup', signUpController)

module.exports = router