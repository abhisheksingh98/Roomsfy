const express = require('express')
const router = express.Router()

const {
    validSignUp,
    validLogin,
    forgotPasswordValidator,
    resetPasswordValidator
} = require('../helpers/valid')

//Controllers
const {signUpController,activationController} = require('../controllers/auth-controller.js')

router.post('/signup', validSignUp,signUpController)
router.post('/activation', activationController)




router.post('/signup', signUpController)

module.exports = router