const express=require('express')
require('./db/mongoose')
const multer=require('multer')
const User=require('./models/user')
const userRouter=require('./routers/user')
const Task=require('./models/task')
const taskRouter=require('./routers/task')
const app=express()
const port=process.env.PORT || 3000

//Middleware example - 1
// const router=new express.Router()
// router.get('/test',async(req,res)=>{
//   res.send("from another router")
// })
// app.use(router)
// app.use((req,res,next)=>{
//     if(req.method=='GET'){
//      res.send('unable to get users now ')
//     }else{
//         next()
//     }
//     // console.log(req.method,req.path)
//     // next() //used so that things lie afterv middleware can run
// })



//Middleware example-2
//will stop all the royters to execute as there is no next() used here
// app.use((req,res,next)=>{
//   res.status(503).send('Site under maintenance . try after some time')
// })

//use https://regex101.com/ for understanding/practicing regular expressions
const upload=multer({
    dest:'images',
    limits:{
        fileSize:1000000
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(doc|docx)$/)){
            return cb(new Error('Please upload a word document '))
        }
        cb(undefined,true)
        //cb(new Error("File must be a pdf"))
        //cb(undefined,true)
        //cb(undefined,false)
    }
})

app.post('/upload',upload.single('upload'),(req,res)=>{
   res.send()
},(error,req,res,next)=>{
    res.status(400).send({error:error.message})
})

app.use(express.json())
app.use(userRouter) //for registering the router
app.use(taskRouter)
// app.post('/users',async(req,res)=>{
//     //console.log(req.body)
//     //c
//     const user=new User(req.body)
//     try{
//       await user.save()
//       res.status(201).send(user)
//     }catch(e){
//         res.status(400).send(e)
//     }
//     // user.save().then(()=>{
//     //     res.send(user)
//     // }).catch((e)=>{
//     //     res.status(400).send(e)
//     // })
// })
// app.get('/users',async(req,res)=>{
//     // console.log("***********************")
//     // console.log(User.find())
//     try{
//       const users=await User.find({})
//       res.send(users)
//     }catch(e){
//        res.status(500).send()
//     }
//     // User.find().then((users)=>{
//     //     res.send(users)
//     // }).catch(()=>{
//     //     res.status(500).send(e)
//     // })
// })
// app.get('/users/:id',async(req,res)=>{
//     // console.log(req.params)
//     // console.log(req.params.id)
//     const _id=req.params.id //here _id does not needs to be converted to a object as it getrs stored as a object like we used to do in MondoDb , instead this is being done itself by Mongoose
//     try{
//       const user=await User.findById(_id)
//       if(user==null)return res.status(404).send()
//       res.send(user)
//     }catch(e){
//        res.status(500).send()
//     }
//     // User.findById(_id).then((user)=>{
//     //     if(user==null){
//     //         return res.status(404).send()//It's just a fluke that Andrew did not get 500. The findById method will throw an error if the id you pass it is improperly formatted so you should see a 500 error most of the time. However, if you pass in an id that is validly formatted, but does not exist in the database then you will get the 404 sent back.
//     //     }
//     //     res.send(user)
//     // }).catch((e)=>{
//     //     res.status(500).send()
//     // })
// })
// app.patch('/users/:id',async(req,res)=>{
//     const updates=Object.keys(req.body)
//     const allowedUpdates=['name','email','password','age']
//     const isValidOperation=updates.every((update) => allowedUpdates.includes(update))
//     if(!isValidOperation) return res.status(400).send({error:"Invalid updates"})
//     try{
//        const user=await User.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
//        if(!user)return res.status(404).send()// try to pass in json file data as {"name":""} for seeing the 404 status
//        res.send(user)
//     }catch(e){
//        res.status(400).send(e)
//     }
// })
// app.delete('/users/:id',async(req,res)=>{
//   try{
//     const user=await User.findByIdAndDelete(req.params.id)
//     if(!user)return res.status(404).send()
//     res.send(user)
//   }catch(e){
//     res.status(500).send(e)
//   }
// })
// app.post('/tasks',async(req,res)=>{
//     const task=new Task(req.body)
//     try{
//       await task.save()
//       res.status(201).send(task)
//     }catch(e){
//      res.status(400).send(e)
//     }
//     // task.save().then(()=>{
//     //     res.status(201)
//     //     res.send(task)
//     // }).catch((e)=>{
//     //     res.status(400)
//     //     res.send(e)
//     // })
// })

// app.get('/tasks',async(req,res)=>{
//     try{
//       const tasks=await Task.find()
//       res.send(tasks)
//     }catch(e){
//         res.status(500).send(e)
//     }
//     // Task.find().then((tasks)=>{
//     //   res.send(tasks)
//     // }).catch((e)=>{
//     //  res.status(500).send(e)
//     // })
// })
// app.get('/tasks/:id',async(req,res)=>{
//     const _id=req.params.id
//     try{
//      const task=await Task.findById(_id)
//         if(!task)return res.status(404).send()
//         res.send(task)
//     }catch(e){
//         res.status(500).send()
//     }
//     // Task.findById(_id).then((task)=>{
//     //    if(task==null){return res.status(404).send()}
//     //    res.send(task)
//     // }).catch((e)=>{
//     //    res.status(500).send()
//     // })
// })
// app.patch('/tasks/:id',async(req,res)=>{
//     const updates=Object.keys(req.body)
//     const allowedUpdates=['description','completed']
//     const isValidOperation=updates.every((update)=>{
//         return allowedUpdates.includes(update)
//     })
//     if(!isValidOperation)return res.status(400).send({error:"Invalid updates"})
//     try{
//       const task=await Task.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
//       if(!task)return res.status(404).send()
//       res.send(task)
//     }catch(e){
//       res.status(400).send(e)
//     }
// })
// app.delete('/tasks/:id',async(req,res)=>{
//   try{
//     const task=await Task.findByIdAndDelete(req.params.id)
//     if(!task)return res.status(404).send()
//     res.send(task)
//   }catch(e){
//     res.status(500).send(e)
//   }
// })
app.listen(port,()=>{
    console.log("Server is up on port"+port)
})
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
// const myFunction=async()=>{
//     console.log("hello")
//     const token=jwt.sign({_id:'abc123'},'thisismynewcourse',{expiresIn:'7 days'}) //1st argument is Id and 2nd argument is signature for that token
//     console.log(token)
//     //here token is composed of 3 parts separated by 2 periods in which 1st part is header , 2nd part is body 
//     const data=jwt.verify(token,'thisismynewcourse')
//     console.log("********************************************************")
//     console.log(data)
// }
// // const myFunction=async()=>{
// //  const password='Red1234!'
// //  const hashedPasswd=await bcrypt.hash(password,8);
// //  const isMatch=await bcrypt.compare('Red1234!',hashedPasswd)
// //  console.log(password)
// //  console.log(hashedPasswd)
// //  console.log(isMatch)
// // }
// myFunction()

// const main=async()=>{
//     // const task=await Task.findById('6133c86a580ea231a499dc72')
//     // await task.populate('owner').execPopulate() //is used on basic of task and user models relationship
    
//     // console.log(task.owner)
//     const user=await User.findById('6133c709359a5b3b64f80898')
//     await user.populate('tasks').execPopulate()
//     console.log(user.tasks)

// }
// main()