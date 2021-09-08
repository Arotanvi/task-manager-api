const mongodb=require('mongodb')
// const mangoClient=mongodb.MongoClient
// const ObjectId=mongodb.ObjectID

const {MongoClient,ObjectID}=require('mongodb')

const connectionURL='mongodb://127.0.0.1:27017' //writing FULL IP instead of localhost makes the app to connect to URl faster 
const databaseName='task-manager'
const id=new ObjectID() //function to generate new Object IDs for us
console.log(id)
console.log(id.getTimestamp())
console.log(id.id) //Bonary string id with with _id gets stored in Database
console.log(id.id.length)
console.log(id.toHexString().length)


MongoClient.connect(connectionURL,{useNewUrlParser:true},(error,client)=>{
    if(error){
        return console.log("Unable to connect to database")
    }
    console.log('connected correctly')
    const db=client.db(databaseName)

    //here in below $set is the operator
    // const updatePromise=db.collection('users').updateOne({
    //     _id:new ObjectID('60eb405590215a3764f6c32b')
    // },{
    //     // $set:{
    //     //     name:'Mike'
    //     // }
    //     $inc:{
    //         age:3
    //     }
    // })
    // updatePromise.then((result)=>{
    //    console.log(result)
    // }).catch((error)=>{
    //    console.log(error)
    // })

    // const updatePromise=db.collection('tasks').updateMany({ completed:false},{
    //      $set:{ completed:true}
    //  })
    // updatePromise.then((result)=>{
    //     console.log(result)
    // }).catch((error)=>{
    //     console.log(error)
    // })

    // db.collection('users').deleteMany({age:'26'}).then((result)=>{
    //   console.log(result)
    // }).catch((error)=>{
    // console.log(error)
    // })

    db.collection('users').deleteOne({age:'36'}).then((result)=>{
       console.log(result)
    }).catch((error)=>{
       console.log(error)
    })

    //in below line try to put age as 28 and in other case age as 1
    // db.collection('users').findOne({name:'Jen',age:1},(error,user)=>{
    //     if(error){return console.log("Unable to fetch the data")}
    //     console.log(user)
    // })
    // db.collection('users').findOne({_id:new ObjectID("60ebe10f1f837109a8a57ba6")},(error,user)=>{
    //     if(error){return console.log("Unable to fetch the data")}
    //     console.log(user)
    // })
    
    //find Method returns the cursor thus requires to use a toArray method along with it
    // db.collection('users').find({ age: "26"}).toArray((error,users)=>{
    //     console.log("*******************")
    //     console.log(users)
    // })
    // db.collection('users').find({ age: "26"}).count((error,count)=>{
    //     console.log("*******************")
    //     console.log(count)
    // })
    // db.collection('tasks').find({ _id:new ObjectID("60ebdf40e16b863968547224")}).toArray((error,users)=>{
    //     console.log("Last task")
    //     console.log(users)
    // })
    // db.collection('tasks').find({ completed:false}).toArray((error,users)=>{
        
    //     console.log(users)
    // })
    // db.collection('users').insertOne({
    //     name:'Ajay',
    //     age:'36'
    // },(error,result)=>{
    //     if(error){return console.log('unable to insert the user')}
    //     console.log(result.ops)
    // })
    // db.collection('users').insertOne({
    //     _id:id,
    //     name:'Vikram',
    //     age:'26'
    // },(error,result)=>{
    //     if(error){return console.log('unable to insert the user')}
    //     console.log(result.ops)
    // })
    // db.collection('users').insertMany([
    //     {
    //         name:'Jen',
    //         age:'28'

    //     },{
    //         name:'Gunther',
    //         age:'44'
    //     }
    // ],(error,result)=>{
    //     if(error){return console.log('unable to insert the user')}
    //     console.log(result.ops)
    // })
    // db.collection('tasks').insertMany([
    //     {
    //         description:'task of watching TV',
    //         completed:true

    //     },{
    //         description:'Task of finishing the dishes',
    //         completed:false
    //     },{
    //         description:'Task of playing the ball',
    //         completed:false
    //     }
    // ],(error,result)=>{
    //     if(error){return console.log('unable to insert the user')}
    //     console.log(result.ops)
    // })
})
