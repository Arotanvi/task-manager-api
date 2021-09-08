const express=require('express')
const Task=require('../models/task')
const auth=require('../middleware/auth')
const router=new express.Router()
router.post('/tasks',auth,async(req,res)=>{
    //const task=new Task(req.body)
    const task=new Task({
      ...req.body,
      owner:req.user._id
    })
    try{
      await task.save()
      res.status(201).send(task)
    }catch(e){
     res.status(400).send(e)
    }
    // task.save().then(()=>{
    //     res.status(201)
    //     res.send(task)
    // }).catch((e)=>{
    //     res.status(400)
    //     res.send(e)
    // })
})

//Get /tasks?completed=true
//Get /tasks?limit=10&skip=20  is being used for pagination purposes 
//Get /tasks?sortBy=createdAt_asc OR /tasks?sortBy=createdAt:desc
router.get('/tasks',auth,async(req,res)=>{
  const match={}
  const sort={}
  if(req.query.completed){
    match.completed=req.query.completed==='true'
  }
  if(req.query.sortBy){
    const parts=req.query.sortBy.split(':')
    sort[parts[0]]=parts[1]==='desc'?-1:1
  }
    try{
      //const tasks=await Task.find()

      ///Method 1 ( will work too )
      // const tasks=await Task.find({owner:req.user._id})
      // if(!tasks)return res.status(404).send()
      // res.send(tasks)

      //Method 2 ( will owrk too )
      await req.user.populate({
        path:'tasks',
        match,
        options:{
          limit:parseInt(req.query.limit),
          skip:parseInt(req.query.limit),
          sort
          // sort:{
          //    //createdAt:1  //-1 is for descending and 1 is for ascending order 
          //    completed:1  //will show completed task first and icompleted afterwards and vice-versa
          // }
        }
      }).execPopulate()
      res.send(req.user.tasks)
    }catch(e){
        res.status(500).send(e)
    }
    // Task.find().then((tasks)=>{
    //   res.send(tasks)
    // }).catch((e)=>{
    //  res.status(500).send(e)
    // })
})
router.get('/tasks/:id',auth,async(req,res)=>{
    const _id=req.params.id
    try{
     //const task=await Task.findById(_id)
     const task=await Task.findOne({_id,owner:req.user._id})
        if(!task)return res.status(404).send()
        res.send(task)
    }catch(e){
        res.status(500).send()
    }
    // Task.findById(_id).then((task)=>{
    //    if(task==null){return res.status(404).send()}
    //    res.send(task)
    // }).catch((e)=>{
    //    res.status(500).send()
    // })
})
router.patch('/tasks/:id',auth,async(req,res)=>{
    const updates=Object.keys(req.body)
    const allowedUpdates=['description','completed']
    const isValidOperation=updates.every((update)=>{
        return allowedUpdates.includes(update)
    })
    if(!isValidOperation)return res.status(400).send({error:"Invalid updates"})
    try{
      //const task=await Task.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
      //const task=await Task.findById(req.params.id)
      const task=await Task.findOne({_id:req.params.id,owner:req.user._id})
      if(!task)return res.status(404).send()
      updates.forEach((update)=>task[update]=req.body[update])
      await task.save()
      res.send(task)
    }catch(e){
      res.status(400).send(e)
    }
})
router.delete('/tasks/:id',auth,async(req,res)=>{
  try{
    //const task=await Task.findByIdAndDelete(req.params.id)
    const task=await Task.findOneAndDelete({_id:req.params.id,owner:req.user._id})
    if(!task)return res.status(404).send()
    res.send(task)
  }catch(e){
    res.status(500).send(e)
  }
})
module.exports=router