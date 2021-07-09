const User = require('../models/auth-model')
const expressJwt = require('express-jwt')
const _  = require('lodash')
const fetch = require('node-fetch')
const {validationResult} = require('express-validator')
const jwt = require('jsonwebtoken')
// Custom error handler to get useful error from DB errors
const {errorHandler} = require('../helpers/dbErrorHandling')

const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.MAIL_KEY)

exports.signUpController = (req, res) => {
    const {name, email, password} = req.body
    const errors = validationResult(req)

    if(!error.isEmpty()){
        const firstError = errors.array().map(error => error.msg)[0]
        return res.status(422).json({
            errors: firstError
        })
    } else {
        User.findOne({
            email
        }).exec((err, user) => {
            //if user exists
            if(user){
                return res.status(400).json({
                    errors: "Email is taken"
                })
            }
        })

        //Generate Token
        const token = jwt.sign(
            {
                name,
                email,
                password
            },
            process.env.JWT_ACCOUNT_ACTIVATION,
            {
                expiresIn: '25m'
            }
        )

        const emailData = {
            from: process.env.EMAIL_FROM,
            to: to,
            subject: 'Account Activation Link',
            html : `
            <h1>Please Click the below link to Activate your account</h1>
            <p>${process.env.CLIENT_URL}/users/activate/${token}</p>
            <hr/>
            `
        }
        sgMail.send(emailData).then(sent =>{
            return res.json({
                message: `Email has been sent to ${email}`
            })
        }).catch(err => {
            return res.status(400).json({
                error: errorHandler(err)
            })
        })
    }
}