const mongoose = require("mongoose")
const User = require("../models/Users")
const bcrypt= require("bcrypt")
require("dotenv").config();

const dbConnect = ()=>{
    mongoose.connect(process.env.DATABASE_URL).then(()=>{
        console.log("database Connected Successfully");
    }).catch((err)=>{
        console.log('error connecting the database');
        console.log(err);
        process.exit(1);
    })
}
module.exports = dbConnect;
