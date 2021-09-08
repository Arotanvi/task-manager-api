const jwt=require('jsonwebtoken')
const User=require('../models/user')
const auth=async(req,res,next)=>{
    // console.log("auth middleware")
    // next()
    try{
      console.log("From auth middleware")
      const token=req.header('Authorization').replace('Bearer ','')
      const decoded=jwt.verify(token,process.env.JWT_SECRET) //decoded is in form { _id: 'abc123', iat: 1630666976, exp: 1631271776 }
      const user=await User.findOne({_id:decoded._id,'tokens.token':token})
      if(!user){
          throw new Error()
      }
      req.token=token
      req.user=user
      next()
    }catch(e){
        res.status(401).send({error:'Please authenticate correctly'})
    }
}
module.exports=auth