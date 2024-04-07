const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
    },
    contactNumber:{
        type:String,
        required:true,
        trim:true,
    },
    email:{
        type:String,
        required:true,
        trim:true,
    },
    role:{
        type:String,
        default:"Client",
        enum:["Admin","Client"]
    },
    city:{
        type:String,
        required:true,
        trim:true,
    },
    district:{
        type:String,
        required:true,
        trim:true,
    },
    state:{
        type:String,
        required:true,
        trim:true,
    },
    gender:{
        type:String,
        required:true,
        trim:true,
    },
    password:{
        type:String,
        required:true,
        trim:true,
    },
    createdAt:{
        type:Date(),
        default:Date.now(),
    },
    complaintId:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Complaints"
    }],
    // for reset password
    resetToken:{
        type:String,
    },
    resetPasswordExpiry:{
        type:String
    }
})

module.exports = mongoose.model("Users",userSchema)