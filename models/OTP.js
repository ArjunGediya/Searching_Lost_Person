const mongoose=require("mongoose")
const mailSender = require("../utils/mailsender")

const otpSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        trim:true,
    },
    otp:{
        type:String,
        required:true,
        expires:5*60*60*1000
    },
    createdAt:{
        type:Date,
        default:Date.now(),
        expires:5*60*1000,
    }
})

async function sendVerificationEmail(email,otp){
    try{
        const mailResponse =await mailSender(email,otp);
        console.log("email send successfully");
        console.log(mailResponse);
    }catch(err){
        console.log("error sending email");
        console.log(err);
    }
}
otpSchema.pre("save",async function(next){
    await sendVerificationEmail(this.email,this.otp);
    next();
})

module.exports = mongoose.model("OTP",otpSchema);