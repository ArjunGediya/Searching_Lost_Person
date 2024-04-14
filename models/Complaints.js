const mongoose = require("mongoose")

const complaintDetailsSchema = new mongoose.Schema({
    image:{
        type:String,
        required:true,
    },
    name:{
        type:String,
        required:true,
    },
    age:{
        type:String,
        required:true,
    },
    gender:{
        type:String,
        required:true,
    },
    physicalDescription:{
        type:String,
        required:true,
    },
    lastSeenLocation:{
        type:String,
        required:true,
    },
    district:{
        type:String,
        required:true
    },
    contactNumber:{
        type:String,
        required:true,
    },
    addtionalDetails:{
        type:String,
    },
    createdAt:{
        type:String,
        default:Date.now().toLocaleString('en-IN'),
    },
    Users:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Users",
        required:true,
    }
})

module.exports = mongoose.model("Complaints",complaintDetailsSchema)