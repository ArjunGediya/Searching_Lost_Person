const express = require("express");
const router = express.Router();


const {signUp,login,getCurrentUser,logout} = require("../controllers/Auth")
const {complaint} = require("../controllers/complaint")
const {deleteComplaint} = require("../controllers/deleteComplaints")
const {complaintsonLocation} = require("../controllers/complaintsonLocation")
const {getallcomplaints} = require("../controllers/getallcomplaints")
const {auth} = require("../middlewares/auth")


// for login 
router.post("/login",login)
//for signup
router.post("/signUp",signUp)
// get current user
router.get("/getCurrentUser",auth,getCurrentUser)

// for getting all complaints
router.get("/getallComplaints",auth,getallcomplaints)

// complaint based on user location
router.get("/getallComplaintOnLocation",auth,complaintsonLocation)
// for logout
router.get("/logout",auth,logout)

// for creatinf the complaint
router.post("/createComplaint",auth,complaint)

// for deleting the complaint
router.delete("/deleteComplaint/:id",auth,deleteComplaint)


module.exports =router;
