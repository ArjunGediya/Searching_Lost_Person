const Complaints = require("../models/Complaints")

exports.getallcomplaints = async(req,res)=>{
    try{
        const getallcomplaints = await Complaints.find().populate("Users").exec();
        return res.status(200).json({
            success:true,
            message:"Allpost fetched successfully",
            Complaints:getallcomplaints,
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