const User = require("../models/Users")
const Complaints = require("../models/Complaintdetails")

exports.deleteComplaint = async(req,res)=>{
    try{
        const userId = req.user
        const id = req.params.id
        const dcomplaint = await Complaints.findByIdAndUpdate({_id:id});
        const updatedUser = await User.findOne({_id:userId},{$pull:{Complaints:dcomplaint._id}},{new:true})
        res.status(200).json({
            success:true,
            message:"Complaint deleted Successfully",
            updatedUser
        })
    }catch(err){
        res.status(500).json({
            success:false,
            message:"error in deleting the complaint",
            err:err.message
        })
    }
}