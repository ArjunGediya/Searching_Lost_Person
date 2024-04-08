const mongoose = require("mongoose")
const User = require("../models/Users")
const bcrypt= require("bcrypt")
require("dotenv").config();

const dbConnect = ()=>{
    mongoose.connect(process.env.DATABASE_URL).then(()=>{
        console.log("database Connected Successfully");
        createAdmin();
    }).catch((err)=>{
        console.log('error connecting the database');
        console.log(err);
        process.exit(1);
    })

    async function createAdmin(){
        try{
            // check if the admin is already present
            let admin = await User.findOne({role:"Admin"})
            if(admin){
                console.log("Admin is Already present");
                return;
            }
        }catch(err){
            console.log("error while reading data for admin");
        }
        // if admin is not present
        try{
            const newAdmin = new User({
                name:"Arjun Gediya",
                contactNumber:"1234567890",
                email:"silvercharlie123@gmail.com",
                role:"Admin",
                city:"Bhavnagar",
                district:"Bhavnagar",
                state:"Gujarat",
                gender:"Male",
                password:await bcrypt.hash("abc!123",10),
            })
            const savedAdmin = newAdmin.save()
            console.log("Admin Created Successfully",newAdmin);
        }catch(err){
            console.log("error creating the user");
            console.log(err);
        }
    }
}
module.exports = dbConnect;
