const cloudinary = require("cloudinary").v2
require("dotenv").config();

const cloudinaryConnet = ()=>{
    try{
        cloudinary.config({
            cloud_name:process.env.CLOUD_NAME,
            api_key:process.env.API_KEY,
            api_secret:process.env.API_SECRET,
        })
    }catch(err){
        console.log("error connecting cloudinary");
        console.log(err);
    }
}

module.exports = cloudinaryConnet



