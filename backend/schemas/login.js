const mongoose = require('mongoose')

var LoginSchema = mongoose.Schema({
    __v: { type: Number, select: false },
    username:String,
    password:String,
    session_count:{type:Number,default:0}
})

module.exports = mongoose.model('Login',LoginSchema)