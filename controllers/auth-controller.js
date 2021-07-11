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

exports.activationController = (req, res) => {
    const { token } = req.body;
  
    if (token) {
      jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, (err, decoded) => {
        if (err) {
          console.log('Activation error');
          return res.status(401).json({
            errors: 'The link is expired. Please Sign Up again'
          });
        } else {
          const { name, email, password } = jwt.decode(token);
  
          console.log(email);
          const user = new User({
            name,
            email,
            password
          });
  
          user.save((err, user) => {
            if (err) {
              console.log('Save error', errorHandler(err));
              return res.status(401).json({
                errors: errorHandler(err)
              });
            } else {
              return res.json({
                success: true,
                message: user,
                message: 'Sign Up successful'
              });
            }
          });
        }
      });
    } else {
      return res.json({
        message: 'Please try again!!'
      });
    }
  };

  
exports.loginController = (req, res) => {
    const { email, password } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const firstError = errors.array().map(error => error.msg)[0];
      return res.status(422).json({
        errors: firstError
      });
    } else {
      // check if user exist
      User.findOne({
        email
      }).exec((err, user) => {
        if (err || !user) {
          return res.status(400).json({
            errors: 'User with this email does not exist. Please sign Up'
          });
        }
        // authenticate
        if (!user.authenticate(password)) {
          return res.status(400).json({
            errors: 'Email and password does not match'
          });
        }
        // generate a token and send to client
        const token = jwt.sign(
          {
            _id: user._id
          },
          process.env.JWT_SECRET,
          {
            expiresIn: '7d'
          }
        );
        const { _id, name, email, role } = user;
  
        return res.json({
          token,
          user: {
            _id,
            name,
            email,
            role
          }
        });
      });
    }
  };