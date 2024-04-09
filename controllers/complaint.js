const cloudinary = require("cloudinary").v2
const User = require("../models/Users")
const Complaints = require("../models/Complaintdetails")
exports.complaints = async(req,res)=>{
    try{
        // fetch the user details from decoded token
        const {userID} = req.user
        console.log(userID);
        // fetch the required fields from req.body
        const {name,
            age,
            gender,
            physicalDescription,
            lastSeenLocation,
            contactNumber,
            addtionalDetails} = req.body
        // fetch the image
        const imagefile = req.files.image
        // validate all
        if(!name || !age || !gender || !physicalDescription || !lastSeenLocation || !contactNumber || !imagefile ){
            return res.status(401).json({
                successs:false,
                message:"Please fillup the required details and the filename must not contain special character"
            })
        }
        //check the filetype
        const supportedTypes =["png","jpeg","jpg"]
        const fileType = `${imagefile.name.split(".")[1].toLowercase()}`
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
        // entry in complaint collection
        const newComplaint = new Complaints({
            image:link,
            name,
            age,
            gender,
            physicalDescription,
            lastSeenLocation,
            contactNumber,
            addtionalDetails,
            userId
        })
        const savedComplaint = newComplaint.save()
        // update the user
        const updatedUser = await User.findByIdAndUpdate(userID,{$push:{complaintId:(await savedComplaint)._id}},{new:true}).populate("Complaints").exec();
        // send response
        res.status(200).json({
            success:true,
            message:"Complaint registered successfully",
            updatedUser,
        })
    }
    catch(err){
        console.log("error registering rh complaints")
        console.log(err)
        return res.status(500).json({
            success:false,
            message:"Something went wrong while registering the complaint,Please try again"
        })
    }
}