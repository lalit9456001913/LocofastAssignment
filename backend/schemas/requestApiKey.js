const mongoose = require('mongoose')
let Schema = mongoose.Schema
var apiRequestSchema = mongoose.Schema({
    __v: { type: Number, select: false },
    userId:{ type: Schema.Types.ObjectId, ref: "User" },
    apiKey:String,
    hitTime:{type:Date,required:true}
})

module.exports = mongoose.model('apiRequest',apiRequestSchema)