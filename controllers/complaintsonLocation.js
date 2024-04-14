const User = require("../models/Users")
const Complaint = require("../models/Complaints")

exports.complaintsonLocation = async(req,res)=>{
    try{
        const userId = req.user.id;
        console.log(userId);
        const user = await User.findById(userId)
        const ComplaintsOnLocation = await Complaint.find({district:user.district}).populate("Users").exec()
        return res.status(200).json({
            success:true,
            message:"Allpost fetched successfully",
            Complaints:ComplaintsOnLocation,
        })
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:"Something went wrong ,Please try again",
            error:err.message
        })
    }
}