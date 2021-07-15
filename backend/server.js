/************ create mongo connection */
const mongoose = require('mongoose');
mongoose.Promise = global.Promise
url = 'mongodb://localhost:27017/locoFastDb';
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
var uuid = require('uuid');
/************************* */
const port = 4000
const express = require('express')
const app = express()
const server = require('http').createServer(app);
const bodyParser = require('body-parser')
/*************manage session */
var session = require('express-session')
/************************** */
const jwt = require('jsonwebtoken')

/*******import models here */
require('./schemas/blogPost')
require('./schemas/users')
require('./schemas/login')
require('./schemas/requestApiKey')

const blogPost = mongoose.model('blogPost')
const User = mongoose.model('User')
const Login = mongoose.model('Login')
const apiRequest = mongoose.model('apiRequest')
const SECRET_KEY = "locofast"
/*************************** */

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());

app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'healthstatus',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60000 }
}))

const verifyUser = (req,res,next) => {
  //getting the token from header
  const token = req.headers['x-auth-token']
  const apiKey = req.headers['apikey']
  console.log(apiKey)
  if (!token && !apiKey) return res.status(401).send({"status": false, "code": 401, "msg": "TOKEN_NOT_FOUND "});
  
  try{
    if(!token){
      User.findOne({apiKey:apiKey}).then(data=>{
        req.user=data  
        req.session.username = req.user.username
        next();
      })
    }else{
      const decodedTokenData=jwt.verify(token, SECRET_KEY)
      req.user=decodedTokenData.user 
      req.session.username = req.user.username
      next();
    }
  }
  catch(exception) {
      res.status(401).send({"status": false, "code": 401, "msg": "INVALID_TOKEN"});
  }
}



app.post('/login',async(req,res)=>{
  console.log(req.user)
  const {username,password} = req.body
  const user =await User.findOne({username:username,password:password}).select("_id username email")

  if(user){
    let loginObj = await Login.findOne({username:username,password:password})

    if((loginObj && loginObj.session_count<3) || !loginObj){
      jwt.sign({user},SECRET_KEY,(err,token)=>{
        if(err){
          res.status(403).send({"msg":"eigther username or password is wrong"})
        }else{
          if(loginObj==undefined){
            loginObj={
              _id:new mongoose.mongo.ObjectID(),
              username:username,
              password:password,
              session_count:1
            }
          }else{
            loginObj.session_count+=1
          }
          Login.findOneAndUpdate({_id:loginObj._id},loginObj,{upsert:true},function(err){
            if(err){
              throw err
            }
          })
          req.session.username = username
          req.session.userId= user._id
          req.session.loginObjId = loginObj._id
          console.log('this is login object id',req.session.loginObjId)
          res.setHeader('x-auth-token', token)
          console.log(user)
          res.status(200).send(user);
        }
      })
    }else{
      res.status(403).json({"msg":"you are already login 3 places please logout from any one of them for again login"})
    }
    
  }else{
    res.status(400).json({"msg":"eigther username or password is wrong"})
  }
})

app.get('/Logout', (req, res) => {
  const sess = req.session;
  var data = {
      "Data": ""
  };
  
  Login.update({_id:sess.loginObjId},{ $inc: { session_count: -1 }},function(err,obj){
    if(err){
      throw err
    }
    console.log(obj)
  });
  sess.destroy(function(err) {
      if (err) {

          data["Data"] = 'Error destroying session';
          res.json(data);
      } else {
          data["Data"] = 'Session destroy successfully';
          res.removeHeader('x-auth-token')
          res.status(200).json(data);
      }
  });
})

app.get('/searchBlog/:search',verifyUser,async(req,res)=>{
  let variable = req.params.search
  let userIds = await User.find({username:variable}).distinct('_id')
  let filter={$or:[{title:variable},{author:{$in:userIds}}]}
  try{
    blogPost.find(filter)
    .populate('author')
    .exec((err,blog)=>{
      if(err){
        console.log(err)
        jsonResp.mongoError.resp(res,err)
        return
      }
      res.json(blog)
    })
  }catch(error){
      console.log(error)
      res.json({"error":error})
  }
})

app.post('/updateUser',(req,res)=>{
    let user = req.body.user
    if(user._id == undefined){
      user._id = new mongoose.mongo.ObjectID()
      user.role = "normal",
      user.apiKey=uuid.v4();
    }
    try{
        User.findOneAndUpdate({_id:user._id},user,{new:true,upsert:true},function(err,user){
          if (err) {
            jsonResp.mongoError.resp(res,err)
            return
          }
          res.status(200).json({data:user})
        })
    }catch(e){
        res.json({"error":e})
    }
})
app.get('/getAllBlogs/:userId',verifyUser,async(req,res)=>{
    let user =await User.findOne({_id:req.params.userId})
    let filter = user.role=='admin'?{}:{author:req.params.userId}
    console.log(filter)
    try{
        blogPost.find(filter)
        .populate({ path: 'author' })
        .exec((err,blogs)=>{
          if(err){
            jsonResp.mongoError.resp(res,err)
            return
          }
          console.log(blogs)
          res.json(blogs)
        })
    }catch(e){
        res.json({"error":e})
    }
 })
 app.get('/getAllUserBlogsUsingApiKey',verifyUser,async(req,res)=>{
  let user =req.user
  let currTime = new Date()
  let lastTime  = new Date()
  lastTime.setMinutes( lastTime.getMinutes() - 5 );
  
  let filter = user.role=='admin'?{}:{author:req.params.userId}
  
  try{
    let getCount = await apiRequest.find({apiKey:user.apiKey,hitTime:{$gte:lastTime}})
   
    if(getCount.length<100){
      let apiKeyObj={
        _id: new mongoose.mongo.ObjectID(),
        apiKey:user.apiKey,
        userId:user._id,
        hitTime:new Date()
      }
     
      apiRequest.create(apiKeyObj,function(err,apiObj){
      if(err){
        console.log(err)
      }
      console.log(apiObj)
      blogPost.find(filter)
      .populate({ path: 'author' })
        .exec((err,blogs)=>{
          if(err){
            jsonResp.mongoError.resp(res,err)
            return
          }
          res.json(blogs)
        })
      })
    }else{
      res.status(403).json({"msg":"your have cross the request limit please try after 5 min"})
    }
  }catch(e){
      res.json({"error":e})
  }
})

/*****get details of one blog */
app.get('/getOneBlog',verifyUser,(req,res)=>{
    let blogId = req.params.blogId
    try{
        blogPost.findOne({_id:blogId})
        .populate('users')
        .exec((err,blog)=>{
          if(err){
            jsonResp.mongoError.resp(res,err)
            return
          }
          res.json(blog)
        })
    }catch(e){
        res.json({"error":e})
    }
 })
/*************************************** */
/*********** update blog *****/
app.post('/updateBlog',verifyUser,(req,res)=>{
  console.log(req.body.blog)
    let blog=req.body.blog
    if (blog._id == undefined) {
      blog._id = new mongoose.mongo.ObjectID()
    }
    try{
      blogPost.findOneAndUpdate({_id:blog._id},blog,{new:true,upsert:true},function(err,blog){
        if (err) {
          throw err
        }
        console.log(blog)
        res.sendStatus(200)
      })
    }catch(e){
      res.json({"error":e})
    }
  })
  /***************************************** */

  /***************** delete monitor url  */
app.delete('/deleteBlog',verifyUser,(req,res)=>{
    try{
      blogPost.findByIdAndRemove({_id:req.body._id},function(err,result){
        if(err){
          console.log('error',err)
          jsonResp.mongoError.resp(res,err)
          return
        }
        res.status(200).json({"msg":"deleted"})
      })
    }catch(e){
      res.json({"error":e})
    }
  })
  
  /************************************ */


server.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })