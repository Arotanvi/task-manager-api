const mongoose=require('mongoose')
const validator=require('validator')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const Task=require('./task')
// mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api',{
//     useNewUrlParser:true,
//     useCreateIndex:true
// })
const userSchema=mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        unique:true,
        required:true,
        trim:true,
        lowercase:true,
        async validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email value entered by user is not valid ')
            }
            const isEmailPresent=await User.findOne({value})
            if(isEmailPresent==true){
                throw new Error("Email already exists");
            }
        }
    },
    password:{
        type:String,
        required:true,
        trim:true,
        minLength:7,
        validate(value){
            if(value.toLowerCase().includes('password')){
                throw new Error(' enter some another value for password ')
            }
            // if(validator.contains(value,"password")){
            //     throw new Error(' enter some another value for password ')
            // }
            if(!validator.isByteLength(value,7,undefined)){
                throw new Error(' Length of password  must be greater than 6 ')
            }
        }
    },
    age:{
        type:Number,
        default:0,
        validate(value){
            if(value<0){
                throw new Error('Age must be a positive number')
            }
        }
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }],
    avatar:{
        type:Buffer
    }
},{
    timestamps:true
})

//	Virtual property is being used to create a relation b/w /models/User and /models/Tasks which is not a new array being created but is just a link between 2 models 
userSchema.virtual('tasks',{
   ref:'Task',
   localField:'_id',
   foreignField:'owner'
})

//this ToJSON method will be called every time on every user as res.send will call stringfy and will call toJSON everytime whose behaviour we have changed 
userSchema.methods.toJSON=function(){
    const user=this
    const userObject=user.toObject()
    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar
    return userObject
}
userSchema.methods.generateAuthToken= async function(){
  const user=this
  const token=jwt.sign({_id:user._id.toString()},process.env.JWT_SECRET)
  user.tokens=user.tokens.concat({token:token})
  await user.save()
  return token

}
userSchema.statics.findByCredentials=async(email,password)=>{
    const user=await User.findOne({email})
    if(!user){
        throw new Error('unable to login')
    }
    const isMatch=await bcrypt.compare(password,user.password)
    if(!isMatch){
        throw new Error('unable to login')
    }
   return user
}

//here userSchema is being created only for the purpose of middleware , middleware is responsible for performing some functions on user before major functions like save the user , validate the user etc
//Express calls your middleware in order, one-by-one. In order to tell Express when one middleware has finished, you call next() which tells it to move onto the next middleware in the chain.
userSchema.pre('save',async function(next){
    const user=this
    if(user.isModified('password')){
        user.password=await bcrypt.hash(user.password,8)
    }
    next()

})

//deletes the tasks when its owner/user is getting deleted too
userSchema.pre('remove',async function(next){
    const user=this
    await Task.deleteMany({owner:user._id})
    next()
})
const User=mongoose.model('User',userSchema)
module.exports=User