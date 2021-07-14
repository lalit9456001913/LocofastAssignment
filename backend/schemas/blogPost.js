const mongoose = require('mongoose')

let UserModel = require("./users.js")

let Schema = mongoose.Schema
var blogPostSchema = mongoose.Schema({
    __v: { type: Number, select: false },
    title:String,
    author:{ type: Schema.Types.ObjectId, ref: "User" },
    content:String
})
module.exports = mongoose.model('blogPost',blogPostSchema)