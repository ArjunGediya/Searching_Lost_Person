const jwt = require("jsonwebtoken")
require("dotenv").config()

exports.auth = async(req,res)=>{
    try{
        // fetch the details from cookie or authorisation
        const token = req.cookie || req.header("Authorisation").replace("bearer","")
        // validate
        if(!token){
            return res.status(401).json({
                success:false,
                message:"error token missing for authorisation"
            })
        }
        try{
            const decodedToken = jwt.verify(token,process.env.JWT_SECRET)
            console.log(decodedToken);
            // pass the decode  in request body in the user
            req.user = decodedToken
        }catch(err){
            res.status(401).json({
                success:false,
                message:"invalid token"
            })
        }
        next();
    }catch(err){
        console.log("error in authorisation  ",err);
        return res.status(500).json({
            success:false,
            message:"Internal Server Error,Please try again after some time"
        })
    }
}


// isAdmin
exports.isAdmin = async(req,res)=>{
    try{
        const role = req.user.role;
        if(role!=="Admin"){
            return res.status(401).json({
                success:false,
                message:"This is the protected route for admin only"
            })
        }
    }catch(err){
        console.log(err);
        res.status(500).json({
            success:false,
            message:"User role can't be verified ,Please try again"
        })
    }
}

// isClient
exports.isClient = async(req,res)=>{
    try{
        const role = req.user.role;
        if(role!=="Client"){
            return res.status(401).json({
                message:"This is the protected route for Clients"
            })
        }
    }catch(err){
        console.log(err);
        res.status(500).json({
            success:false,
            message:"User role can't be verified ,Please try again"
        })
    }
}