const User = require("../models/Users")
const Complaints = require("../models/Complaints")

exports.deleteComplaint = async(req,res)=>{
    try{
        const userId = req.user.id
        const id = req.params.id
        const dcomplaint = await Complaints.findByIdAndDelete(id);
        const updatedUser = await User.findByIdAndUpdate({_id:userId},{$pull:{Complaints:dcomplaint._id}},{new:true}).populate("Complaints").exec()
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