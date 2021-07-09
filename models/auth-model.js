const mongoose = require('mongoose')
const crypto = require('crypto')

// User Schemas

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true,
        lowercase: true
    },
    name: {
        type: String,
        trim: true,
        required: true,
    },
    hashed_password: {
        type: String,
        required: true
    },
    salt: String,
    role : {
        type: String,
        default: 'Normal'
    },
    resetPasswordLink: {
        data: String,
        default:''
    }
},{timeStamp: true})

userSchema.virtual('password')
.set(function (password) {
    this.password = password
    this.salt = this.makeSalt()
    this.hashed_password = this.encryptPassword(password)
})
.get(function(){
    return this._password
})

//methods
userSchema.methods = {
    //Salt
    makeSalt: function(){
        return Math.round(new Date().valueOf()*Math.random()) + ''
    },
    //Password Encrypt
    encryptPassword: function(password){
        if(!password) return ''
        try {
            return crypto.createHmac('sha1', this.salt)
            .update(password)
            .digest('hex')
        }
        catch (err) {
            return ''
        }
    },

    //Plain and hashed password Comparison
    authenticate: function(plainPassword){
        return this.encryptPassword(plainPassword) === this.hashed_password
    }
}

module.exports = mongoose.model('User',userSchema);