import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    confirmEmail:{
        type:Boolean,
        default:false
    },
    isOnline:{
        type:Boolean,
        default:false
    },
    isDelete:{
        type:Boolean,
        default:false
    },
    lastSeen:Date,
    age:Number,
    phone:String,
    code:String
},{
    timestamps:true
})
const userModel = mongoose.model('User',userSchema)
export default userModel