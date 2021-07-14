/************ create mongo connection */
const mongoose = require('mongoose');
mongoose.Promise = global.Promise
url = 'mongodb://localhost:27017/locoFastDb';
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

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
const blogPost = mongoose.model('blogPost')
const User = mongoose.model('User')
const Login = mongoose.model('Login')
const SECRET_KEY = "locofast"
/*************************** */

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());

app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'healthstatus',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}))

const verifyUser = (req,res,next) => {
  //getting the token from header
  const token = req.headers['x-auth-token']
  if (!token) return res.status(401).send({"status": false, "code": 401, "msg": "TOKEN_NOT_FOUND"});
  try{
      const decodedTokenData=jwt.verify(token, SECRET_KEY)
      req.user=decodedTokenData.user  //decodedTokenData= {mobile: "213123421", uid: "JOIASD2134234", firstName: "pritesh"}
      req.session.username = req.user.username
      next();
  }
  catch(exception) {
      res.status(401).send({"status": false, "code": 401, "msg": "INVALID_TOKEN"});
  }
}

app.post('/login',async(req,res)=>{
  const {username,password} = req.body
  const user =await User.findOne({username:username,password:password}).select("_id username email")

  if(user){
    if(user.session_count<3){
      jwt.sign({user},SECRET_KEY,(err,token)=>{
        if(err){
          res.status(403).send({"msg":"eigther username or password is wrong"})
        }else{
          req.session.username = username
          res.setHeader('x-auth-token', token)
          res.status(200).send(user);
        }
      })
    }else{
      res.status(403).send({"msg":"you are already login 3 places please logout from any one of them for again login"})
    }
    
  }else{
    res.status(403).send({"msg":"eigther username or password is wrong"})
  }
})

app.get('/Logout', async(req, res) => {
   
  const sess = req.session;
  var data = {
      "Data": ""
  };
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

app.get('/searchBlog',(req,res)=>{
  let variable = req.body.variable
  let filter;
  if(mongoose.Types.ObjectId.isValid(variable)){
    filter = { author: mongoose.mongo.ObjectID(variable) }
  }else{
    filter = { title:variable }
  }
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
    }
    try{
        User.findOneAndUpdate({_id:user._id},user,{new:true,upsert:true},function(err,user){
          if (err) {
            jsonResp.mongoError.resp(res,err)
            return
          }
          console.log(user)
          res.status(200).json({data:user})
          })
    }catch(e){
        res.json({"error":e})
    }
})
app.get('/getAllBlogs',async(req,res)=>{
    try{
        blogPost.find({})
        .populate({ path: 'author' })
        .exec((err,blogs)=>{
          if(err){
            jsonResp.mongoError.resp(res,err)
            return
          }
          res.json(blogs)
        })
    }catch(e){
        res.json({"error":e})
    }
 })

/*****get details of one blog */
app.get('/getOneBlog',(req,res)=>{
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
app.put('/updateBlog',(req,res)=>{
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
        res.status(200).json({data:blog})
      })
    }catch(e){
      res.json({"error":e})
    }
  })
  /***************************************** */

  /***************** delete monitor url  */
app.delete('/deleteBlog',(req,res)=>{
    try{
      blogPost.findByIdAndRemove({_id:req.body.blog._id},function(err,result){
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
//   if (variable.match(/^[0-9a-fA-F]{24}$/)) {
//     // it's an ObjectID    
// } else {
//     // nope    
// }

server.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })