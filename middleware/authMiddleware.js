//Here we will verify the JWT token and check whether the user is admin or not
const User=require('../models/userModel');
const jwt=require('jsonwebtoken');
const asyncHandler=require("express-async-handler");

/*const authMiddleware = async (req, res, next) => {
    const token = req.body.token || req.query.token || req.headers["auth-token"];
    if (!token) {
      res
        .status(200)
        .send({ success: false, msg: "A token is required for authorization" });
    }
    try {
      const descode = jwt.verify(token, JWT_SECRET);
      req.user = descode;
    } catch (error) {
      res.status(400).send("Invalid Token");
    }
    return next();
  };*/

const authMiddleware=asyncHandler(async(req,res,next)=>{
    let token;
    if(req?.headers?.authorization?.startsWith("Bearer")){
        token=req.headers.authorization.split(" ")[1];
        try {
            if(token){
                const decoded=jwt.verify(token,process.env.JWT_SECRET);
                const user=await User.findById(decoded?.id);
                req.user=user;
                next();
            }
        } catch (error) {
            throw new Error("Not authorized token expired , PLease Login again");
            
        }
    }else{
        throw new Error("There is no token attached to header");
    }
});

//new middleware
const isAdmin=asyncHandler(async(req,res,next)=>{
    const{email}=req.user;
    const adminUser=await User.findOne({email});
    if(adminUser.role !== "admin"){
        throw new Error("You are not an admin");
    }else{
        next();
    }

});
module.exports={authMiddleware,isAdmin};