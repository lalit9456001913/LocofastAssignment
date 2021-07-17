require('./schemas/blogPost')
require('./schemas/users')
require('./schemas/login')
require('./schemas/requestApiKey')
const mongoose = require('mongoose');
const blogPost = mongoose.model('blogPost')
const User = mongoose.model('User')
const Login = mongoose.model('Login')
const apiRequest = mongoose.model('apiRequest')
const jwt= require ('jsonwebtoken')
var uuid = require('uuid');
const SECRET_KEY = "locofast"

exports.login=async(req,res)=>{
    try{
        const {username,password} = req.body
        const user =await User.findOne({username:username,password:password}).select("_id username email role requestLimit apiKey")
    
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
                res.status(403).json({"error":err})
              }
            })
            req.session.username = username
            req.session.userId= user._id
            req.session.loginObjId = loginObj._id
            console.log('this is login object id',req.session.loginObjId)
            res.cookie('x-auth-token', token, { httpOnly: true })
            res.setHeader('x-auth-token',token)
            console.log(user)
            res.status(200).send(user);
            }
        })
        }else{
        res.status(403).json({"msg":"you are already login 3 places please logout from any one of them for again login"})
        }
        
    }else{
        res.status(403).json({"msg":"eigther username or password is wrong"})
     }
    }catch(error){
      res.status(500).json({"error":error})
    }
}
exports.search=async(req,res)=>{
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
}
exports.logout=(req,res)=>{
    try{
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
                res(403).json(data);
            } else {
                data["Data"] = 'logout successfully';
                res.clearCookie('x-auth-token')
                res.status(200).json(data);
            }
        });
    }catch(err){
        res.status(500).json({"msg":err})
    }
}
exports.createUser=(req,res)=>{
    try{
        let user = req.body.user
        if(user._id == undefined){
        user._id = new mongoose.mongo.ObjectID()
        user.role = "normal",
        user.apiKey=uuid.v4();
        user.requestLimit=100;
        }
        User.findOneAndUpdate({_id:user._id},user,{new:true,upsert:true},function(err,user){
          if (err) {
            res.status(403).json({"error":err})
          }
          res.status(200).json({data:user})
        })
    }catch(e){
        res.status(500).json({"error":e})
    }   
}
exports.updateUser=(req,res)=>{
    try{
        let user = req.body.user
        user._id = user._id
        user.role = user.role
        user.apiKey=user.apiKey;
        user.requestLimit=user.requestLimit;
        User.findOneAndUpdate({_id:user._id},user,{new:true,upsert:true},function(err,user){
          if (err) {
            res.status(403).json({"error":err})
          }
          res.status(200).json({data:user})
        })
    }catch(e){
        res.status(500).json({"error":e})
    }   
}
exports.getAllUserBlogsUsingApiKey=async(req,res)=>{
  try{
    let user =req.user
    console.log(user)
    let currTime = new Date()
    let lastTime  = new Date()
    lastTime.setMinutes( lastTime.getMinutes() - 5 );
    
    let filter = user.role=='admin'?{}:{author:user.userId}
    let getCount = await apiRequest.find({apiKey:user.apiKey,hitTime:{$gte:lastTime}})
    console.log(getCount)
    if(getCount.length<user.requestLimit){
      let apiKeyObj={
        _id: new mongoose.mongo.ObjectID(),
        apiKey:user.apiKey,
        userId:user._id,
        hitTime:new Date()
      }
     
      apiRequest.create(apiKeyObj,function(err,apiObj){
      if(err){
        res.status(403).json({"error":err})
      }
      console.log(apiObj)
      blogPost.find(filter)
      .populate({ path: 'author' })
        .exec((err,blogs)=>{
          if(err){
            res.status(403).json({"error":err})
          }
          res.status(200).json(blogs)
        })
      })
    }else{
      res.status(403).json({"msg":"your have cross the request limit please try after 5 min"})
    }
  }catch(e){
      res.json({"error":e})
  }
}
exports.getOneBlog=(req,res)=>{
    try{
        let blogId = req.params.blogId
        blogPost.findOne({_id:blogId})
        .populate('users')
        .exec((err,blog)=>{
          if(err){
            res.status(403).json({"error":err})
          }
          res.status(200).json(blog)
        })
    }catch(e){
        res.status(500).json({"error":e})
    }
}
exports.getAllBlogs=async(req,res)=>{
    try{
        let user =await User.findOne({_id:req.params.userId})
        let filter = user.role=='admin'?{}:{author:req.params.userId}
        blogPost.find(filter)
        .populate({ path: 'author' })
        .exec((err,blogs)=>{
          if(err){
            res.status(403).json({"error":err})
          }
          console.log(blogs)
          res.status(200).json(blogs)
        })
    }catch(e){
        res.status(500).json({"error":e})
    }
}
exports.updateBlog=(req,res)=>{
    
    let blog=req.body.blog
    if (blog._id == undefined) {
      blog._id = new mongoose.mongo.ObjectID()
    }
    try{
      blogPost.findOneAndUpdate({_id:blog._id},blog,{new:true,upsert:true},function(err,blog){
        if (err) {
            res.status(403).json({"error":err})
        }
        res.status(200).json(blog)
      })
    }catch(e){
      res.status(500).json({"error":e})
    }
}
exports.deleteBlog=async(req,res)=>{
    try{
        let isBlogExist = await blogPost.findOne({_id:req.body.blogId})
        console.log(isBlogExist)
        if(!isBlogExist){
            res.status(403).json({"error":'this blog does not exist'}) 
            return 
        }
        blogPost.findByIdAndRemove({_id:req.body.blogId},function(err,result){
          if(err){
            res.status(403).json({"error":err})
          }
          res.status(200).json({"msg":"deleted"})
        })
      }catch(e){
        res.status(500).json({"error":e})
      }
}
exports.updateRequestLimit=(req,res)=>{
  try{
    let userId = req.body.userId
    let limit = req.body.requestLimit
    
    User.findByIdAndUpdate({_id:userId},{requestLimit:limit},{upsert:true,new:true},function(err,user){
      if(err){
        res.status(403).json({"msg":"request limit did not update"})
      }
      res.status(200).json(user)
    })
  }catch(err){
    res.status(500).json({"error":e})
  }
}