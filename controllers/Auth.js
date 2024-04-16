const User = require("../models/Users")
const otpGenerator = require("otp-generator")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

exports.signUp = async(req,res)=>{
    try{
        // fetch all the details from req.body
        const{name,
            contactNumber,
            email,
            city,
            district,
            password,
            confirmPassword} =req.body
        // validate
        if(!name || !contactNumber || !email || !city || !district  || !password || !confirmPassword){
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
        const existingUser = await User.findOne({email})
       
        if(existingUser){
            return res.status(400).json({
                success:false,
                message:"Uses already register do login"
            })
        }
        // hash the password
        const hashPassword = await bcrypt.hash(password,10);
        // make entry in db
        const newUser = new User({
            name,contactNumber,email,city,district,password:hashPassword
        })
        const savedUser = await newUser.save();
        // send response
        return res.status(200).json({
            success:true,
            savedUser,
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
        const user = await User.findOne({email})
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
            secure:true,
            
            
        }
        return res.cookie("token",token,options).status(200).json({
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
exports.getCurrentUser = async(req,res)=>{
    try{
        const userID = req.user.id
        console.log(userID);

        const user = await User.findById(userID)
        user.password=undefined
        if(!user){
            return res.status(404).json({
                success:false,
                message:"user not found"
            })
        }
        return res.status(200).json({
            success:true,
            user,
            message:"user get successfully"
        })
    }catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            error:err.message,
            message:"Internal Server Error,Please try again after sometime"
        })
    }
}
exports.logout = async(req,res)=>{
    try{
        // remove the token from header authorisaton
        req.headers.authorisation =''
        // reset the cookie and send response
        res.clearCookie('token').status(200).json({
            success:true,
            message:"Logout Successfully"
        })
    }catch(err){
        console.log("error while loging out");
        console.error(err)
        return res.status(500).json({
            success:false,
            message:"Internal serrver error,Please try again"
        })
    }
}