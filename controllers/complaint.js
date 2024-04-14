const cloudinary = require("cloudinary").v2
const User = require("../models/Users")
const Complaints = require("../models/Complaints")
exports.complaint = async(req,res)=>{
    try{
        // fetch the user details from decoded token
        const userID = req.user.id
        console.log(userID);
        // fetch the required fields from req.body
        const {name,
            age,
            gender,
            district,
            physicalDescription,
            lastSeenLocation,
            addtionalDetails} = req.body
        // fetch the image
        const imagefile = req.files.image
        // validate all
        console.log(name   ,  age,  gender,  district,physicalDescription , lastSeenLocation ,  imagefile);
        if(!name || !age || !gender || !district || !physicalDescription || !lastSeenLocation  || !imagefile ){
            return res.status(401).json({
                successs:false,
                message:"Please fillup the required details and the filename must not contain special character"
            })
        }
        //check the filetype
        const supportedTypes =["png","jpeg","jpg"]
        const fileType = `${imagefile.name.split(".")[1].toLowerCase()}`
        // if filetype matches entry in cloudinary
        if(!supportedTypes.includes(fileType)){
            return res.status(401).json({
                success:false,
                message:"Invalid filetype "
            })
        }
        const tempFilePath = imagefile.tempFilePath
        console.log("temp file path --> ",tempFilePath);
        const options ={
            resource_type:"auto",
            folder:"searchLostPerson"
        }
        const cloudinaryImageUploadResponse = await cloudinary.uploader.upload(tempFilePath,options)
        const link = cloudinaryImageUploadResponse.secure_url
        console.log("link of the image ---> ",link);

        // user 
        const user = await User.findById(userID)

        // entry in complaint collection
        const newComplaint = new Complaints({
            image:link,
            name,
            age,
            gender,
            district,
            physicalDescription,
            lastSeenLocation,
            contactNumber:user.contactNumber,
            addtionalDetails,
            Users:userID
        })
        
        const savedComplaint = await newComplaint.save()
        // update the user
        const updatedUser = await User.findByIdAndUpdate(userID,{$push:{Complaints:savedComplaint._id}},{new:true}).populate("Complaints").exec();
        // send response
        res.status(200).json({
            success:true,
            message:"Complaint registered successfully",
            updatedUser,
        })
    }
    catch(err){
        console.log("error registering the complaints")
        console.log(err)
        return res.status(500).json({
            success:false,
            message:"Something went wrong while registering the complaint,Please try again"
        })
    }
}