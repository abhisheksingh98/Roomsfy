const express = require('express')
const morgan = require('morgan')
const bodyparser = require('body-parser')
const cors = require('cors')
const connectDB = require('./config/db')

const app = express()

//Config.env to ./config/config.env
require('dotenv').config({
    path: './config/config.env'
})

connectDB()

app.use(bodyparser.json())

// Config for only development
if(process.env.NODE_ENV==='development'){
    app.use(cors({
        origin: process.env.CLIENT_URL
    }))
    app.use(morgan('dev'))
}

//Routes

const authRoute = require('./routes/auth-route')

app.use('/api/', authRoute);

app.use((req,res,next) => {
    res.status(404).json({
        success:false,
        message:"Page Not Found!"
    })
})

const PORT = process.env.PORT

app.listen(PORT,()=>{
    console.log(`App listening on port ${PORT}`)
})