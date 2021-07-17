const jwt= require ('jsonwebtoken')
const cookieParser = require('cookie-parser');
const express=require('express')
const app=express()
const SECRET_KEY = "locofast"
var session = require('express-session')
const mongoose = require('mongoose');
const blogPost = mongoose.model('blogPost')
const User = mongoose.model('User')
const Login = mongoose.model('Login')
const apiRequest = mongoose.model('apiRequest')

exports.isAdmin = (req,res,next) => {
    //getting the token from header
    const token = req.cookies['x-auth-token']?req.cookies['x-auth-token']:req.headers['x-auth-token']
    if (!token) return res.status(401).send({"status": false, "code": 401, "msg": "TOKEN_NOT_FOUND "});
    
    try{
        const decodedTokenData=jwt.verify(token, SECRET_KEY)
        req.user=decodedTokenData.user 
        req.session.username = req.user.username
        User.findOne({_id:req.user._id},function(err,user){
          if(err){
            throw err
          }
          if(user.role=='admin'){
            console.log('inside  role')
            next();
          }else{
            res.status(401).send({"status": false, "code": 401, "msg": "you do not have admin permission"})
          }
        })
        
      }catch(err){
        res.status(401).send({"status": false, "code": 401, "msg": err});
    }
  }
  
exports.verifyUser = (req,res,next) => {
    //getting the token from header
    const apiKey = req.headers['apikey']
    console.log(req.cookies['x-auth-token'],req.headers['x-auth-token'])
    let token;
    if(apiKey){
        token =req.cookies['x-auth-token']?req.cookies['x-auth-token']:req.headers['x-auth-token']?req.headers['x-auth-token']:null
    }else{
        token =req.cookies['x-auth-token']?req.cookies['x-auth-token']:req.headers['x-auth-token']
    }
    console.log(apiKey,'....',token)
    if (!token && !apiKey) return res.status(401).send({"status": false, "code": 401, "msg": "TOKEN_NOT_FOUND "});
    
    try{
      if(!token){
        User.findOne({apiKey:apiKey}).then(data=>{
          req.user=data  
          req.session.username = req.user.username
          next();
        })
      }else if(!apiKey){
        const decodedTokenData=jwt.verify(token, SECRET_KEY)
        req.user=decodedTokenData.user 
        req.session.username = req.user.username
        next();
      }else{
         User.findOne({apiKey:apiKey}).then(data=>{
          req.user=data  
          req.session.username = req.user.username
          next();
        })
      }
    }
    catch(exception) {
        res.status(401).send({"status": false, "code": 401, "msg": "INVALID_TOKEN"});
    }
  }

