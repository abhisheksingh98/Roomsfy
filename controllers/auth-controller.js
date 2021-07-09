const User = require('../models/auth-model')
const expressJwt = require('express-jwt')

exports.signUpController = (req, res) => {
    const {name, email, password} = req.body
    console.log(name, email, password)
}