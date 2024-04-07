const User = require("../models/Users")
const otpGenerator = require("otp-generator")
const OTP = require("../models/OTP")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

exports.sendOtp = async(req,res)=>{
    try{
    // fetch email from req.body
    const{email}=req.body
    // validate
    if(!email){
        return res .status(401).json({
            success:false,
            message:"Please fill up all the field correctly"
        })
    }
    // generate otp
    let otp = otpGenerator.generate(6,{
        upperCaseAlphabets:false,
        lowerCaseAlphabets:false,
        specialChars:false,
    })
    // otp is unique or not
    let result = await OTP.findOne({otp:otp})
    while(result){
         otp = otpGenerator.generate(6,{
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false,
        })
        result = await OTP.findOne({otp:otp})
    }
    console.log("Generated otp --> ",otp);
    // store otp in database
    const newOtp = new OTP({
        email,otp
    })
    const savedOtp = await newOtp.save();

    res.status(200).json({
        success:true,
        message:"Otp Send Successfully",
        otp,
    })
    }catch(err){
        console.log("error sending the otp",err);
        return res.status(500).json({
            success:false,
            message:"Internal Server Error,Please try Again"

        })
    }
}

exports.signUp = async(req,res)=>{
    try{
        // fetch all the details from req.body
        const{name,
            contactNumber,
            email,
            city,
            district,
            state,
            gender,
            password,
            confirmPassword} =req.body
        // validate
        if(!name || !contactNumber || !email || !city || !district || !state || !gender || !password ||!confirmPassword){
            console.log("fill up all the fields for signup");
            return res.status(401).json({
                success:false,
                message:"Please fill up all the details correctly"
            })
        }
        //make sure both the password matches
        if(password!==confirmPassword){
            console.log("password doesn't matches the confirm password in signup form");
            return res.status(401).json({
                success:false,
                message:"password doesn't matches the confirm password"
            })
        }
        // wheather user already exist
        const existingUser = await User.findOne(email)
        // most recent otp matches the otp from req body
        const recentOtp = await OTP.find(email).sort({createdAt:-1}).limit(1);
        if(recentOtp.length==0){
            return res.status(500).json({
                succes:false,
                message:"otp not found,regenarate OTP"
            })
        }
        else if(recentOtp[0]!=otp){
            return res.status(401).json({
                success:false,
                message:"Invalid Otp "
            })
        }
        // hash the password
        const hashPassword = await bcrypt.hash(password,10);
        // make entry in db
        const newUser = new User({
            name,contactNumber,email,city,district,state,gender,password:hashPassword
        })
        const savedUser = await newUser.save();
        // send response
        return res.status(200).json({
            success:true,
            message:"Registration done Successfully"
        })
    }catch(err){
        console.log("error in signup",err);
        return res.status(500).json({
            success:false,
            message:"Internal Server error,Please try again"
        })
    }
}

exports.login = async(req,res)=>{
    try{
        // fetch all the details from req.body
        const {email,password} = req.body
        // validate all
        if(!email || !password){
            return res.status(401).json({
                success:false,
                message:"Please fill all the details correctly"
            })
        }
        // check user has already registered
        const user = await User.findOne(email)
        if(!user){
            return res.status(401).json({
                success:false,
                message:"user don't exist please register first"
            })
        }
        // password matching
        if(!await bcrypt.compare(password,user.password)){
            return res.status(401).json({
                success:false,
                message:"Incorrect password "
            })
        }
        // generate the token
        const payload={
            email:user.email,
            id:user._id,
            role:user.role,

        }
        const token =jwt.sign(payload,process.env.JWT_SECRET,{
            expiresIn:"2h"
        })
        // place the token in req.user and user .password = undefined
        user.password=undefined;
        
        // place the token in cookie and send response
        const options = {
            expires:new Date(Date.now()+3*24*60*60*1000),
            httpOnly:true,
        }
        res.cookie("Token",token,options).status(200).json({
            success:true,
            token,
            user,
            message:"Logged in Successfully"
        })

    }catch(err){
        console.log("error in login",err);
        return res.status(500).json({
            success:false,
            message:"Internal Server error,Please try again"
        })
    }
}