const mongoose = require('mongoose')

var UserSchema = mongoose.Schema({
    __v: { type: Number, select: false },
    username:String,
    email:String,
    password:{type:String,select:false},
    role:{type:String,default:"normal"},
    apiKey:String
})

module.exports = mongoose.model('User',UserSchema)