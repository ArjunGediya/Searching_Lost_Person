const jwt = require("jsonwebtoken")
require("dotenv").config()

exports.auth = async(req,res,next)=>{
    try{
        // fetch the details from cookie or authorisation
        console.log(req.cookies.token);
        const token = req.cookies.token  || req.header("Authorisation").replace("bearer","")
        
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
        next()
    }catch(err){
        console.log("error in authorisation  ",err);
        return res.status(500).json({
            success:false,
            message:"Internal Server Error,Please try again after some time"
        })
    }
}
