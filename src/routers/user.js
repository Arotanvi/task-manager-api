const express=require('express')
const User=require('../models/user')
const auth=require('../middleware/auth')
const { sendWelcomeEmail , sendCancellationEmail}=require('../emails/account')
const sharp=require('sharp') //use npm i sharp@latest only not the version mentioned in videos
const router=new express.Router()

router.post('/users',async(req,res)=>{
    //console.log(req.body)
    const user=new User(req.body)
    try{
      await user.save()
      sendWelcomeEmail(user.email,user.name) //is a asynchronous process because of send() function
      const token=await user.generateAuthToken()
      res.status(201).send({user,token})
    }catch(e){
        res.status(400).send(e)
    }
    // user.save().then(()=>{
    //     res.send(user)
    // }).catch((e)=>{
    //     res.status(400).send(e)
    // })
})
router.post('/users/login',async(req,res)=>{
   try{
     const user=await User.findByCredentials(req.body.email,req.body.password)
     const token=await user.generateAuthToken()
     res.send({user,token})
   }catch(e){
      res.status(400).send()
   }
})
router.post('/users/logout',auth,async(req,res)=>{
  try{
     req.user.tokens=req.user.tokens.filter((token)=>{
       return token.token!==req.token
     })
     await req.user.save()
     res.send()
  }catch(e){
    res.status(500).send()
  }
})
router.post('/users/logoutAll',auth,async(req,res)=>{
  try{
    req.user.tokens=[]
    req.user.save()
    res.send()
  }catch(e){
    res.status(500).send()
  }
})
router.get('/users',auth,async(req,res)=>{
    // console.log("***********************")
    // console.log(User.find())
    try{
      const users=await User.find({})
      res.send(users)
    }catch(e){
       res.status(500).send()
    }
    // User.find().then((users)=>{
    //     res.send(users)
    // }).catch(()=>{
    //     res.status(500).send(e)
    // })
})
router.get('/users/me',auth,async(req,res)=>{
  console.log('starting GET profile')
  const u=req.user
    try {
        res.send(u)
    } catch (e) {
        console.log(e)
    }
})
router.get('/users/:id',async(req,res)=>{
    // console.log(req.params)
    // console.log(req.params.id)
    const _id=req.params.id //here _id does not needs to be converted to a object as it getrs stored as a object like we used to do in MondoDb , instead this is being done itself by Mongoose
    try{
      const user=await User.findById(_id)
      if(user==null)return res.status(404).send()
      res.send(user)
    }catch(e){
       res.status(500).send()
    }
    // User.findById(_id).then((user)=>{
    //     if(user==null){
    //         return res.status(404).send()//It's just a fluke that Andrew did not get 500. The findById method will throw an error if the id you pass it is improperly formatted so you should see a 500 error most of the time. However, if you pass in an id that is validly formatted, but does not exist in the database then you will get the 404 sent back.
    //     }
    //     res.send(user)
    // }).catch((e)=>{
    //     res.status(500).send()
    // })
})
router.patch('/users/me',auth,async(req,res)=>{
    const updates=Object.keys(req.body)
    const allowedUpdates=['name','email','password','age']
    const isValidOperation=updates.every((update) => allowedUpdates.includes(update))
    if(!isValidOperation) return res.status(400).send({error:"Invalid updates"})
    try{
      // const user=await User.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true}) //this will not call midddleware
       //const user = await User.findById(req.params.id);
    if (!req.user) {
      return res.status(404).send();
    }
    updates.forEach(update => (req.user[update] = req.body[update]));
    await req.user.save(); //bcoz of this middleware will get executed as it was a async function 
 
    res.send(req.user);
    }catch(e){
       res.status(400).send(e)
    }
})
router.delete('/users/me',auth,async(req,res)=>{
  try{
    // const user=await User.findByIdAndDelete(req.user._id) //if u use req.params.id it means we are trying to access a user id passed as a paramater here
    // if(!user)return res.status(404).send()
    // res.send(user)
    await req.user.remove()
    sendCancellationEmail(req.user.email,req.user.name)
    res.send(req.user)
  }catch(e){
    res.status(500).send(e)
  }
})
const multer=require('multer')
const upload=multer({
  limits:{
    fileSize:1000000
  },
  fileFilter(req,file,cb){
    if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
      return cb(new Error('Please upload a image  of jpg/jpeg/png extension '))
  }
  cb(undefined,true)
  }
})
router.post('/users/me/avatar',auth,upload.single('avatar'),async(req,res)=>{
  const buffer=await sharp(req.file.buffer).resize({width:200,height:100}).png().toBuffer()
  req.user.avatar=buffer //getting req.user.buffer from middleware upload.single('avatar')
  await req.user.save()
res.send()
},(error,req,res,next)=>{
  res.status(400).send({error:error.message})
})
//here we are defining 1 more function in route handlers through which express can catch any errors /execeptions

router.delete('/users/me/avatar',auth,async(req,res)=>{
  req.user.avatar=undefined
  await req.user.save()
  res.send()
},(error,req,res,next)=>{
  res.status(400).send({error:error.message})
})

// http://localhost:3000/users/6134b6c704faa22be02e2e95/avatar for viewing the avatar
router.get('/users/:id/avatar',async(req,res)=>{
  try{
     const user=await User.findById(req.params.id)
     if(!user|| !user.avatar){
       throw new Error("")
     }
     res.set('Content-Type','image/png')
     res.send(user.avatar)
  }catch(e){
    res.status(404).send(e)
  }
})
module.exports=router