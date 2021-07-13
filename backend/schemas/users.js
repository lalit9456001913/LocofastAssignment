const mongoose = require('mongoose')

var UserSchema = mongoose.Schema({
    __v: { type: Number, select: false },
    username:String,
    email:String,
    password:String,
    role:{type:String,default:"normal"}
})

module.exports = mongoose.model('User',UserSchema)